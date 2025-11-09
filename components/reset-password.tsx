'use client';

import { cn } from "@/lib/utils";
import { Eye, EyeOff, GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearRequestState } from "@/features/auth/auth.slice";
import { useToastContext } from "@/context/ToastContext";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { success, error } = useToastContext();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const authRequestState = useAppSelector((state) => state.auth.requestState);
  const [errors, setErrors] = useState<any>({
    password: '',
    confirmPassword: ''
  })

  const [visiblePassword, setVisiblePassword] = useState<any>({
    password: false,
    confirmPassword: false
  });

  const [password, setPassword] = useState<any>({
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.password.length < 8) {
      setErrors({
        password: 'Password must be at least 8 characters long',
        confirmPassword: ''
      });
      return;
    }

    if (password.confirmPassword.length < 8) {
      setErrors({
        password: '',
        confirmPassword: 'Password must be at least 8 characters long'
      });
      return;
    }

    if (password.password !== password.confirmPassword) {
      setErrors({
        password: '',
        confirmPassword: 'Password and confirm password must match'
      });
      return;
    }

    // dispatch(resetPassword({ token: token, password: password.password }));
  }
  useEffect(() => {
    if (authRequestState?.type === 'resetPassword') {
      switch (authRequestState?.status) {
        case 'loading':
          break;
        case 'completed':
          success('Password changed successfully')
          router.push('/login');
          break;
        case 'failed':
          error(authRequestState.error || 'Error. Please try again.');
          dispatch(clearRequestState())
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authRequestState]);

  useEffect(() => {
    if (!token) {
      router.push('/forgot-password');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={visiblePassword.password ? "text" : "password"}
                    value={password.password}
                    onChange={(e) => {
                      setPassword({ ...password, password: e.target.value })
                    }}
                    className={cn(
                      "pr-10",
                      errors.password ? 'border-red-500' : ''
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setVisiblePassword({ ...visiblePassword, password: !visiblePassword.password })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                    aria-label={visiblePassword.password ? "Hide password" : "Show password"}
                  >
                    {visiblePassword.password ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-sm text-red-500">{errors.password}</span>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={visiblePassword.confirmPassword ? "text" : "password"}
                    value={password.confirmPassword}
                    onChange={(e) => {
                      setPassword({ ...password, confirmPassword: e.target.value })
                    }}
                    className={cn(
                      "pr-10",
                      errors.confirmPassword ? 'border-red-500' : ''
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setVisiblePassword({ ...visiblePassword, confirmPassword: !visiblePassword.confirmPassword })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                    aria-label={visiblePassword.confirmPassword ? "Hide password" : "Show password"}
                  >
                    {visiblePassword.confirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-sm text-red-500">{errors.confirmPassword}</span>
                )}
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={!password.password.length || !password.confirmPassword.length} >
                Continue
              </Button>
              <div className="flex justify-center">
                <Link href={"/login"} className="text-sm cursor-pointer font-bold hover:underline">
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
