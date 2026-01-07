"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useUserRegisterMutation } from "@/redux/features/auth/auth.api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function SignupForm({
  className,
  role = "tourist",
  ...props
}: React.ComponentProps<"div"> & { role?: string }) {
  const router = useRouter();
  const signupSchema = z.object({
    name: z.string().min(1, "Please enter your full name"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  type SignupSchema = z.infer<typeof signupSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const [userRegister, { isLoading }] = useUserRegisterMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: SignupSchema) => {
    const { confirmPassword, ...payload } = data;
    try {
      const res = await userRegister({ ...payload, role: role.toUpperCase() }).unwrap();
      if(res.success){
        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`);
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
           {/* Full Name */}
           <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-900 uppercase tracking-widest pl-1" htmlFor="name">Full Name</label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#4088FD] transition-all px-5 text-sm font-medium"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] font-bold pl-1">{errors.name.message}</p>
              )}
           </div>

           {/* Email */}
           <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-900 uppercase tracking-widest pl-1" htmlFor="email">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#4088FD] transition-all px-5 text-sm font-medium"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-[10px] font-bold pl-1">{errors.email.message}</p>
              )}
           </div>

           {/* Passwords Row */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-900 uppercase tracking-widest pl-1" htmlFor="password">Password</label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#4088FD] transition-all px-5 text-sm font-medium"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-900 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
              </div>
              <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-900 uppercase tracking-widest pl-1" htmlFor="confirmPassword">Confirm</label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#4088FD] transition-all px-5 text-sm font-medium"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-900 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
              </div>
           </div>
           {(errors.password || errors.confirmPassword) && (
              <p className="text-red-500 text-[10px] font-bold pl-1">
                {errors.password?.message || errors.confirmPassword?.message}
              </p>
           )}
        </div>

        <div className="space-y-5 pt-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-[#4088FD] text-white rounded-xl font-black text-sm shadow-xl shadow-blue-500/25 hover:bg-blue-600 hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-70"
          >
            {isLoading ? "Creating Account..." : "Join the Community"}
          </Button>

          <p className="text-center text-sm font-bold text-gray-400">
             Already a member?{" "}
             <Link href="/login" className="text-[#4088FD] hover:underline decoration-2 underline-offset-4">Sign in</Link>
          </p>
        </div>
      </form>
      
      <p className="text-[10px] text-center text-gray-400 font-medium leading-relaxed max-w-[280px] mx-auto uppercase tracking-tighter">
        By joining, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
