import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { login } from "@/features/auth/auth.slice"
import { useAppDispatch } from "@/hooks/redux"
import { loginSchema, type LoginFormData } from "@/features/auth/auth.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseUser } from "@/model/User.model"
import { setIsLogged, setUser } from "@/features/app/app.slice"
import Image from "next/image"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    await dispatch(login(data))
      .unwrap()
      .then((res: any) => {
        const user = parseUser(res?.data?.data?.user);
        dispatch(setUser(user));
        dispatch(setIsLogged(true));
      })
      .catch((err: any) => {
        setError("root.email", { message: err?.message ?? 'Đăng nhập thất bại' })
      })
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 h-full">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          <form className="p-6 md:p-8 lg:p-10 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold flex flex-row gap-2">Chào mừng đến với<p className="text-main">Pinaco</p></h1>
                <p className="text-balance">Trang dành cho quản trị viên</p>
              </div>

              <Field>
                <FieldLabel htmlFor="email" className="text-sm sm:text-base">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  placeholder="Nhập email"
                  {...register("email")}
                  className={cn(errors.email && "border-destructive", "text-sm sm:text-base h-10 sm:h-11")}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-sm sm:text-base">Mật khẩu</FieldLabel>
                  <a href="#" className="ml-auto text-xs sm:text-sm underline-offset-2 hover:underline" hidden>
                    Bạn Quên mật khẩu
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    {...register("password")}
                    className={cn(
                      "pr-10 text-sm sm:text-base h-10 sm:h-11",
                      errors.password && "border-destructive"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </Field>
              <Field>
                <Button type="submit" className="bg-main text-white font-bold hover:bg-main/90">Đăng nhập</Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden md:block border-l border-gray-200 h-full">
            <Image
              src="/assets/img_home.png"
              width={500}
              height={500}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
