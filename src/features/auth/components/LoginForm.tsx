"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isDemoMode } from "@/lib/demo-mode";
import {
  DEMO_CREDENTIALS,
  RECRUITER_CREDENTIALS,
} from "../data/demo-user";
import { createClient } from "@/lib/supabase/client";
import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/auth.schema";

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });


  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage("");

    // DEMO LOGIN
    if (isDemoMode) {
      const isJobSeeker =
        values.email === DEMO_CREDENTIALS.email &&
        values.password === DEMO_CREDENTIALS.password;

      const isRecruiter =
        values.email === RECRUITER_CREDENTIALS.email &&
        values.password === RECRUITER_CREDENTIALS.password;

      if (!isJobSeeker && !isRecruiter) {
        setErrorMessage("Invalid demo email or password.");
        setIsLoading(false);
        return;
      }

      // Create a temporary demo session
      document.cookie =
        "careerbridge_demo_session=true; path=/; SameSite=Lax";

      // Save the logged-in user's role
      const role = isRecruiter ? "recruiter" : "job_seeker";

      document.cookie =
        `careerbridge_demo_role=${role}; path=/; SameSite=Lax`;

      setIsLoading(false);

      router.replace("/dashboard");
      router.refresh();
      return;
    }

    // REAL SUPABASE LOGIN
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          className="h-12 w-full rounded-lg border border-border px-4 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          {...register("password")}
          className="h-12 w-full rounded-lg border border-border px-4 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white transition-all hover:bg-brand-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        {isLoading ? "Logging In..." : "Login"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-primary hover:underline"
        >
          Create Account
        </Link>
      </p>
    </form>
  );
}