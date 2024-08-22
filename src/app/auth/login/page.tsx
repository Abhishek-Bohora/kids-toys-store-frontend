"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const loginPOST = async (loginFormData: LoginFormValues) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/users/login",
      loginFormData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Login failed");
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export default function Login() {
  const router = useRouter();
  const { setAccessToken, setRefreshToken, clearTokens, setIsAuthenticated } =
    useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (loginFormData: LoginFormValues) => {
    try {
      const { data } = await loginPOST(loginFormData);
      const { accessToken, refreshToken } = data?.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setIsAuthenticated(true);

      const { accessTkn, refreshTkn, isAuthenticated, accessTokenData } =
        useAuthStore.getState();
      // console.log(accessTkn);
      // console.log(isAuthenticated);
      // console.log(accessTokenData);
      router.push("/product");
    } catch (error) {
      clearTokens();
      throw error;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="  w-full max-w-sm">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              {...register("email")}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              {...register("password")}
              className="mt-1"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit">Login</Button>
        </div>
      </form>
    </div>
  );
}
