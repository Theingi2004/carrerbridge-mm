
import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { connection } from "next/server";
import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import { demoUser } from "@/features/auth/data/demo-user";

import ApplyJobForm from "@/features/applications/components/ApplyJobForm";
import DemoApplyJobPage from "@/features/applications/components/DemoApplyJobPage";
interface PageProps {
  params: Promise<{ id: string }>;
}


async function ApplyPageContent({ params }: PageProps) {
  await connection();

  const { id } = await params;

  let userId: string;

  // DEMO MODE AUTHENTICATION
  if (isDemoMode) {
    const cookieStore = await cookies();
    const demoSession = cookieStore.get("careerbridge_demo_session");

    if (demoSession?.value !== "true") {
      redirect("/login");
    }

    return (
      <DemoApplyJobPage
        jobId={id}
        userId={demoUser.id}
      />
    );
  }

  // REAL SUPABASE AUTHENTICATION
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  userId = user.id;

  // Preserve the existing Supabase job lookup for now.
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) {
    notFound();
  }

  return (
    <main className="container-default min-h-screen py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-brand-secondary">
            Job Application
          </p>

          <h1 className="mt-2 text-3xl font-bold text-brand-text">
            Apply for {job.title}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {job.company} · {job.location}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <ApplyJobForm jobId={job.id} userId={userId} />
        </div>
      </div>
    </main>
  );
}

export default function ApplyPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="container-default py-12">
          Loading application form...
        </div>
      }
    >
      <ApplyPageContent params={params} />
    </Suspense>
  );
}
