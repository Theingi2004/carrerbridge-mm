
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demo-mode";
import { getCreatedJobs, getJobsByIds } from "@/features/job/services/job.service";
import type {
  Applicant,
  Application,
  ApplicationStatus,
  CreateApplicationInput,
} from "../types/application.types";
import { getProfilesByIds } from "@/features/profile/services/profile.service";

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
// Get applications submitted for this recruiter's jobs
export async function getApplicationsForRecruiter(
  recruiterId: string
): Promise<Application[]> {
  // DEMO MODE
  if (isDemoMode) {
    const applications = getDemoApplications();
    const jobs = getCreatedJobs();

    // Find jobs belonging to this recruiter
    const recruiterJobIds = jobs
      .filter((job) => job.recruiterId === recruiterId)
      .map((job) => job.id);

    // Find applications submitted for those jobs
    return applications.filter((application) =>
      recruiterJobIds.includes(application.job_id)
    );
  }

  // Supabase recruiter query will be connected
  // after checking the database relationship.
  throw new Error(
    "Recruiter application management is not configured for Supabase yet."
  );
}
// Check whether a job has any applications
export async function hasApplicationsForJob(
  jobId: string
): Promise<boolean> {
  // DEMO MODE
  if (isDemoMode) {
    const applications = getDemoApplications();

    return applications.some(
      (application) => application.job_id === jobId
    );
  }

  // REAL SUPABASE MODE
  const supabase = createClient();

  const { count, error } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("job_id", jobId);

  if (error) {
    throw new Error(error.message);
  }

  return (count ?? 0) > 0;
}

// Update an application's status
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  // DEMO MODE
  if (isDemoMode) {
    const applications = getDemoApplications();

    const updatedApplications = applications.map((application) =>
      application.id === applicationId
        ? {
          ...application,
          status,
          updated_at: new Date().toISOString(),
        }
        : application
    );

    localStorage.setItem(
      DEMO_APPLICATIONS_KEY,
      JSON.stringify(updatedApplications)
    );

    return;
  }

  // Supabase implementation will be added
  // after verifying the database permissions and relationships.
  throw new Error(
    "Application status updates are not configured for Supabase yet."
  );
}
// Get complete applicant information for a recruiter.
export async function getRecruiterApplicants(
  recruiterId: string
): Promise<Applicant[]> {
  const applications = await getApplicationsForRecruiter(recruiterId);

  if (applications.length === 0) {
    return [];
  }

  const userIds = [
    ...new Set(applications.map((application) => application.user_id)),
  ];

  const jobIds = [
    ...new Set(applications.map((application) => application.job_id)),
  ];

  const [profiles, jobs] = await Promise.all([
    getProfilesByIds(userIds),
    Promise.resolve(getJobsByIds(jobIds)),
  ]);

  return applications.map((application) => ({
    ...application,
    profile:
      profiles.find((profile) => profile.id === application.user_id) ?? null,
    job: jobs.find((job) => job.id === application.job_id) ?? null,
  }));
}