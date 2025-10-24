"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof registerSchema>;

const errorCodes: Record<string, string> = {
  USER_ALREADY_EXISTS: "Email already registered. Please sign in instead.",
};

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (data: RegisterInput) => {
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      if (error?.code) {
        const errorMessage = errorCodes[error.code] || "Registration failed. Please try again.";
        toast.error(errorMessage);
        return;
      }

      toast.success("Account created successfully! Please sign in.");
      router.push("/login?registered=true");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white dark:bg-gray-800 shadow-2xl border-2 border-purple-100 dark:border-purple-900/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join our transcript management system
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                {...form.register("name")}
                placeholder="John Doe"
                className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                autoComplete="name"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="john.doe@university.edu"
                className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                autoComplete="email"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                placeholder="At least 6 characters"
                className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                autoComplete="off"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
                placeholder="Re-enter your password"
                className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                autoComplete="off"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
