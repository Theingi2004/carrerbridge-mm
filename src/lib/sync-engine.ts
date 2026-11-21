
import { createClient } from "@/lib/supabase/client";

import {
  getSyncQueue,
  removeFromSyncQueue,
  updateSyncOperation,
} from "@/lib/offline-sync";

let isSyncing = false;

export async function syncPendingChanges(
  userId: string
): Promise<void> {
  if (typeof window === "undefined") return;
  if (!navigator.onLine) return;
  if (isSyncing) return;

  isSyncing = true;

  try {
    const supabase = createClient();

    // Confirm the currently authenticated user.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== userId) {
      return;
    }

    const queue = getSyncQueue().filter(
      (operation) => operation.userId === userId
    );

    for (const operation of queue) {
      try {
        switch (operation.type) {
          case "UPDATE_PROFILE": {
            const { data, error } = await supabase
              .from("profiles")
              .update(operation.payload)
              .eq("id", userId)
              .select("id");

            if (error) throw error;

            if (!data || data.length === 0) {
              throw new Error("Profile update was not applied.");
            }

            break;
          }

          case "CREATE_JOB": {
            const job = operation.payload;

            const payload = {
              id: job.id,
              recruiter_id: userId,
              title: job.title,
              company: job.company,
              location: job.location,
              employment_type: job.employmentType,
              experience_level: job.experienceLevel,
              salary: job.salary,
              category: job.category,
              tags: job.tags,
              description: job.description,
              responsibilities: job.responsibilities,
              requirements: job.requirements,
              benefits: job.benefits,
              status: job.status ?? "active",
              posted_at: job.postedAt,
              expires_at: job.expiresAt,
            };

            const { error } = await supabase
              .from("jobs")
              .insert(payload);

            if (error) throw error;

            break;
          }

          default:
            // Other operations will be implemented later.
            continue;
        }

        removeFromSyncQueue(operation.id);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Synchronization failed.";

        updateSyncOperation(operation.id, message);
      }
    }
  } finally {
    isSyncing = false;
  }
}
