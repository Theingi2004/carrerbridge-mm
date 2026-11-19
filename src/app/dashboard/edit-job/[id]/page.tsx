
import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";

import PostJobForm from "@/features/job/components/PostJobForm";

interface EditJobPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function EditJobContent({ params }: EditJobPageProps) {
  await connection();

  const { id } = await params;

  // DEMO MODE AUTHENTICATION
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
  } else {
    // REAL SUPABASE AUTHENTICATION
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Wait until the Supabase user-role structure is confirmed.
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-default">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-text">
              Edit Job
            </h1>

            <p className="mt-2 text-muted-foreground">
              Update your job opportunity details.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <PostJobForm jobId={id} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function EditJobPage({ params }: EditJobPageProps) {
  return (
    <Suspense
      fallback={
        <main className="container-default py-12">
          <p className="text-sm text-muted-foreground">
            Loading edit page...
          </p>
        </main>
      }
    >
      <EditJobContent params={params} />
    </Suspense>
  );
}