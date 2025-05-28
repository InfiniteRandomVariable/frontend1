"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRegister } from "@/hooks/use-auth";

const registerSchema = z
  .object({
    uName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    userRole: z.enum(["BUYER", "SELLER", "ARBITER"], {
      required_error: "Please select a user role",
    }),
    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const userRole = watch("userRole");
  const password = watch("password");
  const agreeToTerms = watch("agreeToTerms");

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, agreeToTerms, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // Password strength indicators
  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /\d/.test(password || ""),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-slate-800">
            TechBay
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join TechBay</CardTitle>
            <CardDescription>
              Create your account to start buying and selling
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uName">Username</Label>
                <Input
                  id="uName"
                  type="text"
                  placeholder="Choose a unique username"
                  {...register("uName")}
                  className={errors.uName ? "border-red-500" : ""}
                />
                {errors.uName && (
                  <p className="text-sm text-red-600">{errors.uName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...register("password")}
                    className={
                      errors.password ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>

                {password && (
                  <div className="space-y-1 text-xs">
                    <div
                      className={`flex items-center gap-1 ${
                        passwordChecks.length
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      At least 8 characters
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        passwordChecks.uppercase
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      One uppercase letter
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        passwordChecks.lowercase
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      One lowercase letter
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        passwordChecks.number
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      One number
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    className={
                      errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="userRole">Account Type</Label>
                <Select
                  value={userRole}
                  onValueChange={(value) =>
                    setValue(
                      "userRole",
                      value as "BUYER" | "SELLER" | "ARBITER"
                    )
                  }
                >
                  <SelectTrigger
                    className={errors.userRole ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select your account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUYER">
                      Buyer - Purchase products
                    </SelectItem>
                    <SelectItem value="SELLER">
                      Seller - Sell products
                    </SelectItem>
                    <SelectItem value="ARBITER">
                      Arbiter - Mediate disputes
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.userRole && (
                  <p className="text-sm text-red-600">
                    {errors.userRole.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setValue("agreeToTerms", checked as boolean)
                  }
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-orange-600 hover:text-orange-500"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-orange-600 hover:text-orange-500"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600">
                  {errors.agreeToTerms.message}
                </p>
              )}
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={!isValid || registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center text-xs text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy. We'll occasionally send you account-related emails.
        </div>
      </div>
    </div>
  );
}
