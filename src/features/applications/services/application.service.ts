
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demo-mode";
import { demoUser } from "@/features/auth/data/demo-user";

import type {
  Application,
  CreateApplicationInput,
} from "../types/application.types";

const DEMO_APPLICATIONS_KEY = "careerbridge-demo-applications";

// Get demo applications from localStorage
function getDemoApplications(): Application[] {
  const storedApplications = localStorage.getItem(
    DEMO_APPLICATIONS_KEY
  );

  return storedApplications
    ? (JSON.parse(storedApplications) as Application[])
    : [];
}

// Apply for a job
export async function applyForJob(
  userId: string,
  input: CreateApplicationInput
): Promise<Application> {
  // DEMO MODE
  if (isDemoMode) {
    const applications = getDemoApplications();

    const alreadyApplied = applications.some(
      (application) =>
        application.user_id === userId &&
        application.job_id === input.job_id
    );

    if (alreadyApplied) {
      throw new Error("You have already applied for this job.");
    }

    const now = new Date().toISOString();

    const newApplication: Application = {
      id: crypto.randomUUID(),
      user_id: userId,
      job_id: input.job_id,
      cover_letter: input.cover_letter,
      status: "pending",
      created_at: now,
      updated_at: now,
    };

    const updatedApplications = [
      newApplication,
      ...applications,
    ];

    localStorage.setItem(
      DEMO_APPLICATIONS_KEY,
      JSON.stringify(updatedApplications)
    );

    return newApplication;
  }

  // REAL SUPABASE MODE
  const supabase = createClient();

  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: userId,
      job_id: input.job_id,
      cover_letter: input.cover_letter,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("You have already applied for this job.");
    }

    throw new Error(error.message);
  }

  return data as Application;
}

// Get current user's applications
export async function getMyApplications(
  userId: string
): Promise<Application[]> {
  // DEMO MODE
  if (isDemoMode) {
    const applications = getDemoApplications();

    return applications.filter(
      (application) => application.user_id === userId
    );
  }

  // REAL SUPABASE MODE
  const supabase = createClient();

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Application[];
}
