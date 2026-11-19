
import type { Job } from "../types/job.types";
import { demoRecruiterJobs } from "../data/demo-recruiter-jobs";
const STORAGE_KEY = "careerbridge-demo-jobs";

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
export function createJob(job: Job): void {
  const existingJobs = getCreatedJobs();

  const updatedJobs = [job, ...existingJobs];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedJobs)
  );
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
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