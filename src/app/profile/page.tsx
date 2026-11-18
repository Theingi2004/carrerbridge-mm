import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/features/profile/components/ProfileForm";
import type { Profile } from "@/features/profile/types/profile.types";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Step 1: Check logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Step 2: Get user's profile from Supabase
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

  const profile = data as Profile;

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

        <ProfileForm profile={profile} userId={user.id} />
      </div>
    </main>
  );
}