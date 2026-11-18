
import type { Job } from "../types/job.types";

const STORAGE_KEY = "careerbridge-demo-jobs";

// Get all recruiter-created jobs
export function getCreatedJobs(): Job[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedJobs = localStorage.getItem(STORAGE_KEY);

  if (!storedJobs) {
    return [];
  }

  try {
    return JSON.parse(storedJobs) as Job[];
  } catch {
    return [];
  }
}

// Create a new job
export function createJob(job: Job): void {
  const existingJobs = getCreatedJobs();

  const updatedJobs = [job, ...existingJobs];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedJobs)
  );
}
