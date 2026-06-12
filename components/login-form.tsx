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
import { useEffect, useState } from "react"
import { clearAuthState, login, logout } from "@/features/auth/auth.slice"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseUser } from "@/model/User.model"
import { clearAppState, setIsLogged, setUser } from "@/features/app/app.slice"
import Image from "next/image"
import { AuthLoginFormData, authLoginSchema } from "@/features/auth/auth.schema"
import { Spinner } from "./ui/spinner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useAppDispatch()
  const authState = useAppSelector((state) => state.auth.requestState);
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<AuthLoginFormData>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: AuthLoginFormData) => {
    await dispatch(login(data))
      .unwrap()
      .then((res: any) => {
        const { user } = res?.data?.data?.data || {};
        const userData = parseUser(user);
        if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0 && userData.roles[0] === "sales") {
          setError("password", { message: 'Bạn không có quyền truy cập vào trang quản trị viên' })
          dispatch(logout());
          return;
        }

        dispatch(setUser(userData));
        dispatch(setIsLogged(true));
      })
      .catch((err: any) => {
        setError("password", { message: err.message ?? 'Đăng nhập thất bại' })
      })
  };

  useEffect(() => {
    dispatch(clearAppState());
    dispatch(clearAuthState());
  }, [dispatch]);

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
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="text"
                      placeholder="Nhập email"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      className={cn(errors.email && "border-destructive", "text-sm sm:text-base h-10 sm:h-11")}
                      required
                    />
                  )}
                />

                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-sm sm:text-base">Mật khẩu</FieldLabel>
                  <a href="#" className="ml-auto text-xs sm:text-sm underline-offset-2 hover:underline" hidden>
                    Bạn Quên mật khẩu
                  </a>
                </div>
                <div className="relative">
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={cn(errors.password && "border-destructive", "text-sm sm:text-base h-10 sm:h-11")}
                        required
                      />
                    )}
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
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" className="bg-main text-white font-bold hover:bg-main/90 w-full" disabled={authState.status === 'loading'}>
                  {authState.status === 'loading' ? <Spinner /> : 'Đăng nhập'}
                </Button>
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
