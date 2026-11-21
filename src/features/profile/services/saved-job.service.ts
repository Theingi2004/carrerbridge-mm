
import { SavedJob } from "@/features/job/types/saved-job.types";
import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/client";
import { demoUser } from "@/features/auth/data/demo-user";

const STORAGE_KEY = "careerbridge-saved-jobs";

// Return the current Job Seeker ID.
// Recruiters and unauthenticated users cannot save jobs.
async function getJobSeekerId(): Promise<string | null> {
  if (isDemoMode) {
    if (typeof document === "undefined") return null;

    const roleCookie = document.cookie
      .split("; ")
      .find((cookie) =>
        cookie.startsWith("careerbridge_demo_role=")
      );

    const role = roleCookie?.split("=")[1];

    return role === "job_seeker" ? demoUser.id : null;
  }

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);

  return profile?.role === "job_seeker" ? user.id : null;
}

// Get saved jobs from localStorage.
function getDemoSavedJobs(): SavedJob[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);

  return stored ? (JSON.parse(stored) as SavedJob[]) : [];
}

// Save demo bookmarks to localStorage.
function saveDemoSavedJobs(savedJobs: SavedJob[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJobs));
}

export async function getSavedJobs(): Promise<SavedJob[]> {
  const userId = await getJobSeekerId();

  if (!userId) return [];

  if (isDemoMode) {
    return getDemoSavedJobs().filter(
      (savedJob) => savedJob.user_id === userId
    );
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as SavedJob[];
}

export async function saveJob(jobId: string): Promise<void> {
  const userId = await getJobSeekerId();

  if (!userId) {
    throw new Error("Only job seekers can save jobs.");
  }

  if (isDemoMode) {
    const savedJobs = getDemoSavedJobs();

    const alreadySaved = savedJobs.some(
      (savedJob) =>
        savedJob.user_id === userId &&
        savedJob.job_id === jobId
    );

    if (alreadySaved) return;

    const newSavedJob: SavedJob = {
      id: crypto.randomUUID(),
      user_id: userId,
      job_id: jobId,
      created_at: new Date().toISOString(),
    };

    saveDemoSavedJobs([...savedJobs, newSavedJob]);
    return;
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("saved_jobs")
    .insert({
      user_id: userId,
      job_id: jobId,
    });

  if (error) throw new Error(error.message);
}

export async function unsaveJob(jobId: string): Promise<void> {
  const userId = await getJobSeekerId();

  if (!userId) {
    throw new Error("Only job seekers can remove saved jobs.");
  }

  if (isDemoMode) {
    const savedJobs = getDemoSavedJobs();

    const updatedSavedJobs = savedJobs.filter(
      (savedJob) =>
        !(
          savedJob.user_id === userId &&
          savedJob.job_id === jobId
        )
    );

    saveDemoSavedJobs(updatedSavedJobs);
    return;
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) throw new Error(error.message);
}
