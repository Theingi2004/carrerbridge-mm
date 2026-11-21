import { Job } from "@/features/job/types/job.types";
import { Profile } from "@/features/profile/types/profile.types";

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "accepted";

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  cover_letter: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationInput {
  job_id: string;
  cover_letter: string;
}
export interface Applicant extends Application {
  profile: Profile | null;
  job: Job | null;
}