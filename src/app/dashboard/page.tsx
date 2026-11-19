import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { connection } from "next/server";
import MyJobPosts from "@/features/job/components/MyJobPosts";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";
import RecruiterApplications from "@/features/applications/components/RecruiterApplications";
import { initializeDemoRecruiterJobs } from "@/features/job/services/job.service";
import {
  demoUser,
  demoRecruiter,
} from "@/features/auth/data/demo-user";
import LogoutButton from "@/features/auth/LogoutButton";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-brand-background py-12">
          <div className="container-default">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold text-brand-secondary">
                Loading your dashboard...
              </p>
            </div>
          </div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await connection();


  // DEMO MODE
  if (isDemoMode) {
    const cookieStore = await cookies();

    const demoSession = cookieStore.get("careerbridge_demo_session");
    const demoRole = cookieStore.get("careerbridge_demo_role");

    if (demoSession?.value !== "true") {
      redirect("/login");
    }

    // Select the correct demo account
    const currentUser =
      demoRole?.value === "recruiter"
        ? demoRecruiter
        : demoUser;

    const isRecruiter = currentUser.role === "recruiter";
    if (isRecruiter) {
      initializeDemoRecruiterJobs();
    }
    return (
      <main className="min-h-screen bg-brand-background py-12">
        <div className="container-default">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-brand-secondary">
              CareerBridge MM — Demo Mode
            </p>

            <h1 className="mt-3 text-3xl font-bold text-brand-text">
              Welcome, {currentUser.full_name}!
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              {currentUser.email}
            </p>

            <div className="mt-6">
              <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-semibold text-brand-primary">
                {currentUser.role === "recruiter"
                  ? "Recruiter"
                  : "Job Seeker"}
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p>Phone: {currentUser.phone}</p>
              <p>Location: {currentUser.location}</p>
              <p>Headline: {currentUser.headline}</p>
              <p>Bio: {currentUser.bio}</p>

              <div>
                <p className="mb-2 font-semibold text-brand-text">
                  Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-brand-primary/10 px-3 py-1 text-brand-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>


            {isRecruiter && (
              <div className="mt-8 space-y-6">
                <div className="rounded-xl border border-border p-6">
                  <h2 className="text-xl font-bold text-brand-text">
                    Recruiter Dashboard
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Manage your IT job postings and review applications.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-brand-background p-4">
                      <p className="text-sm text-muted-foreground">
                        My Job Posts
                      </p>
                      <p className="mt-2 text-2xl font-bold text-brand-text">
                        Manage Jobs
                      </p>
                    </div>

                    <div className="rounded-lg bg-brand-background p-4">
                      <p className="text-sm text-muted-foreground">
                        Applications
                      </p>
                      <p className="mt-2 text-2xl font-bold text-brand-text">
                        Coming Soon
                      </p>
                    </div>
                  </div>

                </div>
                <MyJobPosts />
                <RecruiterApplications />
              </div>
            )}


            <div className="mt-8">
              <LogoutButton />
            </div>
          </div>
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || user.email || "User";

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-default">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-brand-secondary">
            CareerBridge MM
          </p>

          <h1 className="mt-3 text-3xl font-bold text-brand-text">
            Welcome, {fullName}!
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            {user.email}
          </p>

          {profileError && (
            <p className="mt-3 text-sm text-red-600">
              Unable to load your profile information.
            </p>
          )}

          {profile && (
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p>Phone: {profile.phone || "Not provided"}</p>
              <p>Location: {profile.location || "Not provided"}</p>
              <p>Headline: {profile.headline || "Not provided"}</p>

              <div>
                <p className="mb-2 font-semibold text-brand-text">
                  Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                    profile.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-full bg-brand-primary/10 px-3 py-1 text-brand-primary"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span>No skills added yet.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <LogoutButton />
          </div>
        </div>
      </div>
    </main>
  );
}