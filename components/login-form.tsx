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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const handleAutoLogin = async (email: string) => {
    await onSubmit({ email, password: "12345678" });
  };

  const onSubmit = async (data: LoginSchema) => {
    try {
      const res = await loginUser(data).unwrap();
      if (res.success) {
        toast.success("Logged in successfully");
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="focus-visible:ring-[#4088FD]"
                  {...register("email")}
                />
              </Field>
              {errors.email && (
                <FieldDescription className="text-red-500">
                  {errors.email.message}
                </FieldDescription>
              )}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="focus-visible:ring-[#4088FD]"
                    {...register("password")}
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
                {errors.password && (
                  <FieldDescription className="text-red-500">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  style={{ backgroundColor: '#4088FD', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357ae8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4088FD'}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/register/tourist" className="text-[#4088FD] hover:text-[#357ae8] hover:underline transition-colors">Sign up</Link>
                </FieldDescription>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] h-7 px-2 border-[#4088FD]/30 text-[#4088FD] hover:bg-[#4088FD]/10"
                    onClick={() => handleAutoLogin("khhniloy01@gmail.com")}
                  >
                    Tourist
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] h-7 px-2 border-[#4088FD]/30 text-[#4088FD] hover:bg-[#4088FD]/10"
                    onClick={() => handleAutoLogin("niloy.dev.101@gmail.com")}
                  >
                    Guide
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] h-7 px-2 border-[#4088FD]/30 text-[#4088FD] hover:bg-[#4088FD]/10"
                    onClick={() => handleAutoLogin("khhniloy0@gmail.com")}
                  >
                    Admin
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#" className="text-[#4088FD] hover:text-[#357ae8] hover:underline transition-colors">Terms of Service</a>{" "}
        and <a href="#" className="text-[#4088FD] hover:text-[#357ae8] hover:underline transition-colors">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
