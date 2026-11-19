import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";

import {
  demoUser,
  demoRecruiter,
} from "@/features/auth/data/demo-user";

import ProfileForm from "@/features/profile/components/ProfileForm";
import type { Profile } from "@/features/profile/types/profile.types";

export default function ProfilePage() {
  return (
    <Suspense fallback={<p className="p-8">Loading profile...</p>}>
      <ProfilePageContent />
    </Suspense>
  );
}

async function ProfilePageContent() {
  await connection();

  let profile: Profile;
  let userId: string;

  if (isDemoMode) {
    const cookieStore = await cookies();

    const demoSession = cookieStore.get("careerbridge_demo_session")?.value;
    const demoRole = cookieStore.get("careerbridge_demo_role")?.value;

    if (demoSession !== "true") {
      redirect("/login");
    }

    const currentDemoUser =
      demoRole === "recruiter" ? demoRecruiter : demoUser;

    userId = currentDemoUser.id;

    profile = {
      id: currentDemoUser.id,
      full_name: currentDemoUser.full_name,
      email: currentDemoUser.email,
      phone: currentDemoUser.phone,
      location: currentDemoUser.location,
      headline: currentDemoUser.headline,
      bio: currentDemoUser.bio,
      skills: currentDemoUser.skills,
      avatar_url: currentDemoUser.avatar_url,
    };
  } else {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      return (
        <main className="container-default py-16">
          <h1 className="text-2xl font-bold">
            Unable to load your profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Please try again later.
          </p>
        </main>
      );
    }

    profile = data as Profile;
    userId = user.id;
  }

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-default">
        <div className="mb-8">
          <p className="text-sm font-semibold text-brand-secondary">
            ACCOUNT SETTINGS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-brand-text">
            My Profile
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Manage your personal and professional information.
          </p>
        </div>

        <ProfileForm profile={profile} userId={userId} />
      </div>
    </main>
  );
}