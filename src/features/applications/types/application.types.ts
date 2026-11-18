
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