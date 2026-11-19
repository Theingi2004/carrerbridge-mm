export type JobStatus = "active" | "closed" | "expired";

export interface Job {
  id: string;
  recruiterId?: string;

  title: string;
  company: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salary: string;

  postedAt: string;
  expiresAt?: string;

  category: string;
  tags: string[];
  status?: JobStatus;

  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}