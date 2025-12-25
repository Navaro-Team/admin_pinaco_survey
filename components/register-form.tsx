"use client";

import { Eye, EyeOff, GalleryVerticalEnd } from "lucide-react";
import { useState, useEffect } from "react";
import { useToastContext } from "@/context/ToastContext";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { clearAuthState } from "@/features/auth/auth.slice";
import Link from "next/link";

export function RegisterForm() {
  const { success, error } = useToastContext();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const requestState = useAppSelector((state) => state.auth.requestState);
  // const authEmail = useAppSelector((state) => state.auth.email);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // phone: '',
    // referral: '',
    subscribe: true,
    agree: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const validateFirstName = (firstName: string) => {
    if (!firstName) return 'First name is required';
    return '';
  };
  const validateLastName = (lastName: string) => {
    if (!lastName) return 'Last name is required';
    return '';
  };
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email address';
    return '';
  };
  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };
  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return 'Repeat new password is required';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (typeof value === 'string' && errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    newErrors.firstName = validateFirstName(formData.firstName);
    newErrors.lastName = validateLastName(formData.lastName);
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);
    if (!formData.agree) newErrors.agree = 'You must agree to the terms';
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });
    return newErrors;
  };

  const [showPassword, setShowPassword] = useState<any>({ password: false, confirmPassword: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // await dispatch(register({
    //   firstName: formData.firstName,
    //   lastName: formData.lastName,
    //   email: formData.email,
    //   password: formData.password,
    //   phone: formData.phone,
    //   status: 'active',
    //   role: process.env.USER_ROLE,
    // }));
  };

  useEffect(() => {
    if (requestState?.type === 'register') {
      switch (requestState?.status) {
        case 'completed':
          success("Register", "Please login to continue");
          dispatch(clearAuthState());
          router.push('/login');
          break;
        case 'failed':
          error("Register", requestState.error || 'Please try again');
          dispatch(clearAuthState());
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestState]);
  useEffect(() => {
    const isValid =
      !validateFirstName(formData.firstName) &&
      !validateLastName(formData.lastName) &&
      !validateEmail(formData.email) &&
      !validatePassword(formData.password) &&
      !validateConfirmPassword(formData.confirmPassword, formData.password) &&
      formData.agree;
    //console.log('isValid: ', isValid);
    setIsFormValid(isValid);
  }, [formData]);
  return (
    <div className="w-md p-4 relative z-10 shadow-none">
      <Link
        href="#"
        className="flex flex-col items-center gap-2 font-medium"
      >
        <div className="flex size-8 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-6" />
        </div>
        <span className="sr-only">Acme Inc.</span>
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-center">Create new account</h1>
      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name  <span style={{ color: 'red' }}>*</span></Label>
            <Input
              id="firstName"
              autoFocus={true}
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Last Name <span style={{ color: 'red' }}>*</span></Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email  <span style={{ color: 'red' }}>*</span></Label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="password">New Password <span style={{ color: 'red' }}>*</span></Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword.password ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
              >
                {showPassword.password ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Repeat New Password <span style={{ color: 'red' }}>*</span></Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
              >
                {showPassword.confirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="phone">Phone number (Optional)</Label>
            <Input
              id="phone"
              placeholder="+84"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="referral">Referral ID (Optional)</Label>
            <Input
              id="referral"
              value={formData.referral}
              onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
            />
          </div>
        </div> */}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="subscribe"
              checked={formData.subscribe}
              onCheckedChange={(checked) => setFormData({ ...formData, subscribe: Boolean(checked) })}
            />
            <label htmlFor="subscribe" className="text-sm">
              I want to receive updates, special offers, and promotional emails
            </label>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="agree"
              checked={formData.agree}
              onCheckedChange={(checked) => setFormData({ ...formData, agree: Boolean(checked) })}
            />
            <label htmlFor="agree" className="text-sm">
              Yes, I understand and agree to the license{" "}
              <a href="#" className="underline text-blue-600 cursor-pointer">Terms of Service</a> and{" "}
              <a href="#" className="underline text-blue-600 cursor-pointer">Privacy Policy</a>.
            </label>
          </div>
          {errors.agree && <p className="text-sm text-red-500">{errors.agree}</p>}
        </div>

        <Button
          type="submit"
          className={`w-full text-white cursor-pointer bg-black shadow-none transition-all duration-200`}
          disabled={!isFormValid || requestState.status === "loading"} >
          {requestState.status === "loading" ? "Creating..." : "Create my account"}
        </Button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              router.push("/login");
            }}
            className="text-blue-600 underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
