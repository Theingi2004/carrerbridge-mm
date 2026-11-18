
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import DemoMyApplications from "@/features/applications/components/DemoMyApplications";
import MyApplications from "@/features/applications/components/MyApplications";

export default function MyApplicationsPage() {
  return (
    <main className="container-default min-h-screen py-12">
      <Suspense
        fallback={
          <p className="text-muted-foreground">
            Loading your applications...
          </p>
        }
      >
        <MyApplicationsContent />
      </Suspense>
    </main>
  );
}

async function MyApplicationsContent() {
  // DEMO MODE
  if (isDemoMode) {
    const cookieStore = await cookies();
    const demoSession = cookieStore.get("careerbridge_demo_session");

    if (demoSession?.value !== "true") {
      redirect("/login");
    }

    return <DemoMyApplications />;
  }

  // REAL SUPABASE MODE
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return <MyApplications applications={applications ?? []} />;
}
