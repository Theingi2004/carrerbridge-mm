import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { demoRecruiter } from "@/features/auth/data/demo-user";

import PostJobForm from "@/features/job/components/PostJobForm";

export default function PostJobPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading...</p>}>
      <PostJobContent />
    </Suspense>
  );
}

async function PostJobContent() {
  await connection();

  // DEMO MODE AUTHENTICATION
  if (isDemoMode) {
    const cookieStore = await cookies();

    const demoSession = cookieStore.get("careerbridge_demo_session");
    const demoRole = cookieStore.get("careerbridge_demo_role");

    if (demoSession?.value !== "true") {
      redirect("/login");
    }

    if (
      demoRole?.value !== "recruiter" ||
      !demoRecruiter
    ) {
      redirect("/dashboard");
    }
  } else {
    // REAL SUPABASE AUTHENTICATION
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Recruiter role verification will be added
    // after confirming where your Supabase project stores user roles.
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-default">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-text">
              Post a Job
            </h1>

            <p className="mt-2 text-muted-foreground">
              Create an IT job opportunity for job seekers.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <PostJobForm />
          </div>
        </div>
      </div>
    </main>
  );
}