'use client';

import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearRequestState } from "@/features/auth/auth.slice";
import { useToastContext } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export function ForgotForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error } = useToastContext();

  const authRequestState = useAppSelector((state) => state.auth.requestState);

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({
    email: ''
  });
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email là bắt buộc';
    }
    if (!emailRegex.test(email)) {
      return 'Email không hợp lệ';
    }
    return '';
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    setErrors({
      email: emailError
    });

    if (emailError) {
      return;
    }

    // await dispatch(requestPassword({ email: email }));
  };


  useEffect(() => {
    if (authRequestState?.type === 'requestPassword') {
      switch (authRequestState?.status) {
        case 'loading':
          break;
        case 'completed':
          break;
        case 'failed':
          error(authRequestState.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
          dispatch(clearRequestState())
          break;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authRequestState]);

  if (authRequestState?.type === 'requestPassword' && authRequestState?.status === 'completed') {
    return (
      <div className="flex flex-col gap-6">
        <Link
          href="#"
          className="flex flex-col items-center gap-2 font-medium" >
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span className="sr-only">Acme Inc.</span>
        </Link>
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-xl font-bold">Check your email</h1>
          <span className="text-gray">We&apos;ve sent you an email with instructions to reset your password. Check your inbox and follow the steps there.</span>
          <span className="text-gray">If you don&apos;t request a password change or would like to log in a different account, select &apos;Return to login&apos;.</span>
          <Button
            type="submit"
            className="w-full cursor-pointer"
            onClick={() => {
              dispatch(clearRequestState())
              router.push('/login')
            }} >
            Return to login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </Link>
            <h1 className="text-xl font-bold">Password Recovery</h1>
            <div className="text-gray">Enter the email address</div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-6">
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                required
              />
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email}</span>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={email == ''} >
                Continue
              </Button>
              <div className="flex justify-center">
                <Link href={"/login"} onClick={() => { }} className="text-sm cursor-pointer font-bold hover:underline">
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
