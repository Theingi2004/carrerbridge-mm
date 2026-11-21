
import { isDemoMode } from "@/lib/demo-mode";
import { demoUser } from "@/features/auth/data/demo-user";
import { createClient } from "@/lib/supabase/client";
import {
  addToSyncQueue,
} from "@/lib/offline-sync";

import type {
  Profile,
  UpdateProfileInput,
} from "../types/profile.types";

const DEMO_PROFILE_KEY = "careerbridge-demo-profile";

const getProfileCacheKey = (userId: string) =>
  `careerbridge-profile-${userId}`;

// Check whether an error is likely caused by a network problem.
function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return true;
  }

  const message =
    error instanceof Error
      ? error.message
      : String(error);

  return /network|fetch|offline|connection|timeout/i.test(
    message
  );
}

// Save a real user's profile in the local cache.
function cacheProfile(profile: Profile): void {
  localStorage.setItem(
    getProfileCacheKey(profile.id),
    JSON.stringify(profile)
  );
}

// Read a real user's cached profile.
function getCachedProfile(userId: string): Profile | null {
  try {
    const stored = localStorage.getItem(
      getProfileCacheKey(userId)
    );

    return stored ? (JSON.parse(stored) as Profile) : null;
  } catch {
    return null;
  }
}

// Get the job seeker's profile.
export async function getProfile(): Promise<Profile> {
  // DEMO MODE
  if (isDemoMode) {
    const storedProfile = localStorage.getItem(
      DEMO_PROFILE_KEY
    );

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

  // SUPABASE MODE
  const supabase = createClient();

  // Get the locally persisted session first.
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    throw new Error("You must be logged in to view your profile.");
  }

  const userId = session.user.id;

  // Use cached profile when offline.
  if (!navigator.onLine) {
    const cachedProfile = getCachedProfile(userId);

    if (cachedProfile) {
      return cachedProfile;
    }

    throw new Error(
      "No cached profile is available. Connect to the internet first."
    );
  }

  try {
    // Validate the user with Supabase.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      if (isNetworkError(authError)) {
        const cachedProfile = getCachedProfile(userId);

        if (cachedProfile) return cachedProfile;
      }

      throw new Error(authError.message);
    }

    if (!user || user.id !== userId) {
      throw new Error("Your session is invalid. Please log in again.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (isNetworkError(error)) {
        const cachedProfile = getCachedProfile(userId);

        if (cachedProfile) return cachedProfile;
      }

      throw new Error(error.message);
    }

    const profile = data as Profile;

    cacheProfile(profile);

    return profile;
  } catch (error) {
    if (isNetworkError(error)) {
      const cachedProfile = getCachedProfile(userId);

      if (cachedProfile) return cachedProfile;
    }

    throw error;
  }
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

  // SUPABASE MODE
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    throw new Error("You must be logged in to update your profile.");
  }

  const userId = session.user.id;

  const currentProfile =
    getCachedProfile(userId) ?? await getProfile();

  const updatedProfile: Profile = {
    ...currentProfile,
    ...input,
  };

  // Save locally and queue the update when offline.
  if (!navigator.onLine) {
    cacheProfile(updatedProfile);

    addToSyncQueue({
      userId,
      type: "UPDATE_PROFILE",
      payload: { ...input },
    });

    return updatedProfile;
  }

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw authError;
    }

    if (!user || user.id !== userId) {
      throw new Error("Your session is invalid. Please log in again.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(input)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const profile = data as Profile;

    cacheProfile(profile);

    return profile;
  } catch (error) {
    // Queue only likely network failures.
    // Do not hide authentication or RLS errors.
    if (isNetworkError(error)) {
      cacheProfile(updatedProfile);

      addToSyncQueue({
        userId,
        type: "UPDATE_PROFILE",
        payload: { ...input },
      });

      return updatedProfile;
    }

    throw error;
  }
}

// Get multiple applicant profiles by user IDs.
export async function getProfilesByIds(
  userIds: string[]
): Promise<Profile[]> {
  if (userIds.length === 0) {
    return [];
  }

  // DEMO MODE
  if (isDemoMode) {
    const storedProfile = await getProfile();

    return userIds.includes(storedProfile.id)
      ? [storedProfile]
      : [];
  }

  // SUPABASE MODE
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userIds);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Profile[];
}
