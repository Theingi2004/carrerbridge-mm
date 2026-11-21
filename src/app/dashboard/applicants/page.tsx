
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { connection } from "next/server";

import RecruiterApplications from "@/features/applications/components/RecruiterApplications";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { demoRecruiter } from "@/features/auth/data/demo-user";

export default function ApplicantsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-brand-background py-12">
          <div className="container-default">
            <p className="text-sm text-muted-foreground">
              Loading applicants...
            </p>
          </div>
        </main>
      }
    >
      <ApplicantsContent />
    </Suspense>
  );
}

async function ApplicantsContent() {
  await connection();

  // DEMO MODE
  if (isDemoMode) {
    const cookieStore = await cookies();

    const demoSession = cookieStore.get("careerbridge_demo_session");
    const demoRole = cookieStore.get("careerbridge_demo_role");

    if (demoSession?.value !== "true") {
      redirect("/login");
    }

    if (demoRole?.value !== "recruiter") {
      redirect("/dashboard");
    }

    return (
      <main className="min-h-screen bg-brand-background py-12">
        <div className="container-default">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-text">
              Applicants
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Review and manage applications submitted for your jobs.
            </p>
          </div>

          <RecruiterApplications />
        </div>
      </main>
    );
  }

  // REAL SUPABASE MODE
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "recruiter") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-default">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-text">
            Applicants
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review and manage applications submitted for your jobs.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Recruiter application management for Supabase is not configured yet.
        </p>
      </div>
    </main>
  );
}