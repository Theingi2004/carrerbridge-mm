
import type { Job } from "../types/job.types";
import { demoRecruiterJobs } from "../data/demo-recruiter-jobs";

import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/client";
import { addToSyncQueue } from "@/lib/offline-sync";


const STORAGE_KEY = "careerbridge-demo-jobs";
const SUPABASE_JOB_CACHE_KEY = "careerbridge-supabase-jobs";
// Get cached Supabase jobs.
export function getCachedJobs(): Job[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(
      SUPABASE_JOB_CACHE_KEY
    );

    return stored ? (JSON.parse(stored) as Job[]) : [];
  } catch {
    return [];
  }
}
// Convert a Supabase job row into the frontend Job type.
function mapSupabaseJob(row: Record<string, any>): Job {
  return {
    id: row.id,
    recruiterId: row.recruiter_id,
    title: row.title,
    company: row.company,
    location: row.location,
    employmentType: row.employment_type,
    experienceLevel: row.experience_level,
    salary: row.salary ?? "",
    postedAt: row.posted_at,
    expiresAt: row.expires_at,
    category: row.category,
    tags: row.tags ?? [],
    status: row.status,
    description: row.description,
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    benefits: row.benefits ?? [],
  };
}

// Fetch active public jobs from Supabase.
export async function getPublicJobs(): Promise<Job[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "active")
    .order("posted_at", { ascending: false });

  if (error) {
    throw error;
  }

  const fetchedJobs = (data ?? []).map((row) =>
    mapSupabaseJob(row as Record<string, any>)
  );

  // Update local cache with the latest database jobs.
  fetchedJobs.forEach(saveJobToCache);

  return fetchedJobs;
}
// Save a job to the Supabase local cache.
function saveJobToCache(job: Job): void {
  if (typeof window === "undefined") return;

  const existingJobs = getCachedJobs();

  const updatedJobs = [
    job,
    ...existingJobs.filter((item) => item.id !== job.id),
  ];

  localStorage.setItem(
    SUPABASE_JOB_CACHE_KEY,
    JSON.stringify(updatedJobs)
  );
}
// Initialize demo recruiter jobs without creating duplicates
export function initializeDemoRecruiterJobs(): void {
  if (typeof window === "undefined") {
    return;
  }

  const existingJobs = getCreatedJobs();

  const existingJobIds = new Set(
    existingJobs.map((job) => job.id)
  );

  const missingJobs = demoRecruiterJobs.filter(
    (job) => !existingJobIds.has(job.id)
  );

  if (missingJobs.length === 0) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...missingJobs, ...existingJobs])
  );
}

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
    const jobs = JSON.parse(storedJobs) as Job[];

    const now = new Date();

    const updatedJobs = jobs.map((job) => {
      // Support older jobs that don't have expiresAt yet.
      const expiresAt =
        job.expiresAt ??
        new Date(
          new Date(job.postedAt).getTime() +
          30 * 24 * 60 * 60 * 1000
        ).toISOString();

      const isExpired =
        job.status === "active" &&
        new Date(expiresAt).getTime() <= now.getTime();

      return {
        ...job,
        expiresAt,
        status: isExpired ? "expired" as const : job.status,
      };
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedJobs)
    );

    return updatedJobs;
  } catch {
    return [];
  }
}

// Create a new job

export async function createJob(job: Job): Promise<void> {
  // Step 1: Preserve existing Demo Mode.
  if (isDemoMode) {
    const existingJobs = getCreatedJobs();

    const updatedJobs = [job, ...existingJobs];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedJobs)
    );

    return;
  }

  // Step 2: Get the authenticated Supabase user.
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session?.user) {
    throw new Error("Please log in before posting a job.");
  }

  // Use the actual logged-in recruiter ID.
  const recruiterId = session.user.id;

  const jobData: Job = {
    ...job,
    recruiterId,
  };

  // Step 3: Convert TypeScript fields to database columns.
  const payload = {
    id: jobData.id,
    recruiter_id: recruiterId,
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    employment_type: jobData.employmentType,
    experience_level: jobData.experienceLevel,
    salary: jobData.salary,
    category: jobData.category,
    tags: jobData.tags,
    description: jobData.description,
    responsibilities: jobData.responsibilities,
    requirements: jobData.requirements,
    benefits: jobData.benefits,
    status: jobData.status ?? "active",
    posted_at: jobData.postedAt,
    expires_at: jobData.expiresAt,
  };

  // Step 4: Save locally when offline.
  if (!navigator.onLine) {
    saveJobToCache(jobData);

    addToSyncQueue({
      userId: recruiterId,
      type: "CREATE_JOB",
      payload: jobData as unknown as Record<string, unknown>,
    });

    return;
  }

  // Step 5: Try saving to Supabase.
  try {
    const { error } = await supabase
      .from("jobs")
      .insert(payload);

    if (error) throw error;

    saveJobToCache(jobData);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create job.";

    // Queue only network-related failures.
    const isNetworkError =
      error instanceof TypeError ||
      /network|fetch|offline|connection|timeout/i.test(
        message
      );
    console.log("Job creation error:", error);
    console.log("Is network error:", isNetworkError);

    if (!isNetworkError) {
      throw error;
    }

    saveJobToCache(jobData);

    addToSyncQueue({
      userId: recruiterId,
      type: "CREATE_JOB",
      payload: jobData as unknown as Record<string, unknown>,
    });
  }
}

// Get a single job by ID
export function getJobById(jobId: string): Job | undefined {
  const jobs = getCreatedJobs();

  return jobs.find((job) => job.id === jobId);
}

// Update an existing job
export function updateJob(
  updatedJob: Job,
  recruiterId: string
): void {
  const existingJobs = getCreatedJobs();

  const existingJob = existingJobs.find(
    (job) => job.id === updatedJob.id
  );

  if (!existingJob) {
    throw new Error("Job not found.");
  }

  if (existingJob.recruiterId !== recruiterId) {
    throw new Error("You are not authorized to edit this job.");
  }

  const updatedJobs = existingJobs.map((job) =>
    job.id === updatedJob.id
      ? {
        ...updatedJob,
        recruiterId: existingJob.recruiterId,
        postedAt: existingJob.postedAt,
      }
      : job
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedJobs)
  );
}
export function closeJob(
  jobId: string,
  recruiterId: string
): void {
  const existingJobs = getCreatedJobs();

  const existingJob = existingJobs.find(
    (job) => job.id === jobId
  );

  if (!existingJob) {
    throw new Error("Job not found.");
  }

  if (existingJob.recruiterId !== recruiterId) {
    throw new Error("You are not authorized to close this job.");
  }

  const updatedJobs = existingJobs.map((job) =>
    job.id === jobId
      ? { ...job, status: "closed" as const }
      : job
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedJobs)
  );
}

export function reopenJob(
  jobId: string,
  recruiterId: string
): void {
  const existingJobs = getCreatedJobs();

  const existingJob = existingJobs.find(
    (job) => job.id === jobId
  );

  if (!existingJob) {
    throw new Error("Job not found.");
  }

  if (existingJob.recruiterId !== recruiterId) {
    throw new Error("You are not authorized to reopen this job.");
  }

  const updatedJobs = existingJobs.map((job) =>
    job.id === jobId
      ? { ...job, status: "active" as const }
      : job
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
}
// Extend an expired job for another 30 days
export function extendJob(
  jobId: string,
  recruiterId: string
): void {
  const existingJobs = getCreatedJobs();

  const existingJob = existingJobs.find(
    (job) => job.id === jobId
  );

  if (!existingJob) {
    throw new Error("Job not found.");
  }

  if (existingJob.recruiterId !== recruiterId) {
    throw new Error("You are not authorized to extend this job.");
  }

  if (existingJob.status !== "expired") {
    throw new Error("Only expired jobs can be extended.");
  }

  const newExpirationDate = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const updatedJobs = existingJobs.map((job) =>
    job.id === jobId
      ? {
        ...job,
        status: "active" as const,
        expiresAt: newExpirationDate,
      }
      : job
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedJobs)
  );
}
// Delete a job if it has no applications
export function deleteJob(
  jobId: string,
  recruiterId: string
): void {
  const existingJobs = getCreatedJobs();

  const existingJob = existingJobs.find(
    (job) => job.id === jobId
  );

  if (!existingJob) {
    throw new Error("Job not found.");
  }

  if (existingJob.recruiterId !== recruiterId) {
    throw new Error("You are not authorized to delete this job.");
  }

  const storedApplications = localStorage.getItem(
    "careerbridge-demo-applications"
  );

  const applications = storedApplications
    ? JSON.parse(storedApplications)
    : [];

  const hasApplications = applications.some(
    (application: { job_id: string }) =>
      application.job_id === jobId
  );

  if (hasApplications) {
    throw new Error(
      "This job has applications and cannot be deleted. Please close the job instead."
    );
  }

  const updatedJobs = existingJobs.filter(
    (job) => job.id !== jobId
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedJobs)
  );
}

// Get multiple jobs by their IDs.
export function getJobsByIds(jobIds: string[]): Job[] {
  if (jobIds.length === 0) {
    return [];
  }

  const allJobs = getCreatedJobs();

  return allJobs.filter((job) => jobIds.includes(job.id));
}