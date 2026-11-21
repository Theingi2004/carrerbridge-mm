
import type {
  JobAlert,
  CreateJobAlertInput,
} from "../types/job-alert.types";

import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/client";
import { demoUser } from "@/features/auth/data/demo-user";

const STORAGE_KEY = "careerbridge-demo-job-alerts";

function getJobSeekerId(): string | null {
  if (isDemoMode) {
    if (typeof document === "undefined") {
      return null;
    }

    const role = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("careerbridge_demo_role="))
      ?.split("=")[1];

    return role === "job_seeker" ? demoUser.id : null;
  }

  return null;
}

export async function getJobAlerts(): Promise<JobAlert[]> {
  if (isDemoMode) {
    if (typeof window === "undefined") {
      return [];
    }

    const userId = getJobSeekerId();

    if (!userId) {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const alerts: JobAlert[] = stored ? JSON.parse(stored) : [];

    return alerts.filter((alert) => alert.user_id === userId);
  }

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) return [];

  const { data, error } = await supabase
    .from("job_alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as JobAlert[];
}

export async function createJobAlert(
  input: CreateJobAlertInput
): Promise<JobAlert> {
  if (isDemoMode) {
    const userId = getJobSeekerId();

    if (!userId) {
      throw new Error("Only job seekers can create job alerts.");
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const alerts: JobAlert[] = stored ? JSON.parse(stored) : [];

    const now = new Date().toISOString();

    const newAlert: JobAlert = {
      id: crypto.randomUUID(),
      user_id: userId,
      name: input.name,
      category: input.category ?? "",
      location: input.location ?? "",
      employment_type: input.employment_type ?? "",
      experience_level: input.experience_level ?? "",
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([newAlert, ...alerts])
    );

    return newAlert;
  }

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("Please log in to create a job alert.");
  }

  const { data, error } = await supabase
    .from("job_alerts")
    .insert({
      user_id: user.id,
      name: input.name,
      category: input.category ?? "",
      location: input.location ?? "",
      employment_type: input.employment_type ?? "",
      experience_level: input.experience_level ?? "",
    })
    .select()
    .single();

  if (error) throw error;

  return data as JobAlert;
}


export async function updateJobAlert(
  alertId: string,
  input: Partial<CreateJobAlertInput> & { is_active?: boolean }
): Promise<JobAlert> {
  if (isDemoMode) {
    const userId = getJobSeekerId();

    if (!userId) {
      throw new Error("Only job seekers can update job alerts.");
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const alerts: JobAlert[] = stored ? JSON.parse(stored) : [];

    const updatedAlerts = alerts.map((alert) => {
      if (alert.id !== alertId || alert.user_id !== userId) {
        return alert;
      }

      return {
        ...alert,
        ...input,
        updated_at: new Date().toISOString(),
      };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlerts));

    const updatedAlert = updatedAlerts.find(
      (alert) => alert.id === alertId && alert.user_id === userId
    );

    if (!updatedAlert) {
      throw new Error("Job alert not found.");
    }

    return updatedAlert;
  }

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("Please log in to update a job alert.");
  }

  const { data, error } = await supabase
    .from("job_alerts")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", alertId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  return data as JobAlert;
}

export async function deleteJobAlert(alertId: string): Promise<void> {
  if (isDemoMode) {
    const userId = getJobSeekerId();

    if (!userId) {
      throw new Error("Only job seekers can delete job alerts.");
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const alerts: JobAlert[] = stored ? JSON.parse(stored) : [];

    const updatedAlerts = alerts.filter(
      (alert) => !(alert.id === alertId && alert.user_id === userId)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAlerts));

    if (updatedAlerts.length === alerts.length) {
      throw new Error("Job alert not found.");
    }

    return;
  }

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("Please log in to delete a job alert.");
  }

  const { error } = await supabase
    .from("job_alerts")
    .delete()
    .eq("id", alertId)
    .eq("user_id", user.id);

  if (error) throw error;
}
