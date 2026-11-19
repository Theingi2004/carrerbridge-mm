
import { isDemoMode } from "@/lib/demo-mode";
import { demoUser } from "@/features/auth/data/demo-user";

import type {
  Profile,
  UpdateProfileInput,
} from "../types/profile.types";

import { createClient } from "@/lib/supabase/client";

const DEMO_PROFILE_KEY = "careerbridge-demo-profile";

// Get the job seeker's profile.
export async function getProfile(): Promise<Profile> {
  // DEMO MODE
  if (isDemoMode) {
    const storedProfile = localStorage.getItem(DEMO_PROFILE_KEY);

    if (storedProfile) {
      return JSON.parse(storedProfile) as Profile;
    }

    return {
      id: demoUser.id,
      full_name: demoUser.full_name,
      email: demoUser.email,
      phone: demoUser.phone,
      location: demoUser.location,
      headline: demoUser.headline,
      bio: demoUser.bio,
      skills: demoUser.skills,
      avatar_url: demoUser.avatar_url,
    };
  }

  // REAL SUPABASE MODE
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to view your profile.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}

// Update the job seeker's profile.
export async function updateProfile(
  input: UpdateProfileInput
): Promise<Profile> {
  // DEMO MODE
  if (isDemoMode) {
    const currentProfile = await getProfile();

    const updatedProfile: Profile = {
      ...currentProfile,
      ...input,
    };

    localStorage.setItem(
      DEMO_PROFILE_KEY,
      JSON.stringify(updatedProfile)
    );

    return updatedProfile;
  }

  // REAL SUPABASE MODE
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to update your profile.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}