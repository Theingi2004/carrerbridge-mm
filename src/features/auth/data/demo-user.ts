
export type UserRole = "job_seeker" | "recruiter" | "admin";

export interface DemoUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  location: string;
  headline: string;
  bio: string;
  skills: string[];
  avatar_url: string | null;
  role: UserRole;
}

// Job Seeker account
export const demoUser: DemoUser = {
  id: "demo-user-001",
  email: "demo@careerbridge.mm",
  full_name: "Aung Aung",
  phone: "09-123456789",
  location: "Yangon, Myanmar",
  headline: "Junior Frontend Developer",
  bio: "Passionate about building modern web applications.",
  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  avatar_url: null,
  role: "job_seeker",
};

// Recruiter account
export const demoRecruiter: DemoUser = {
  id: "demo-recruiter-001",
  email: "recruiter@careerbridge.mm",
  full_name: "Demo Recruiter",
  phone: "09-987654321",
  location: "Yangon, Myanmar",
  headline: "HR Manager at ABC Technology",
  bio: "Responsible for hiring IT professionals.",
  skills: ["Recruitment", "Human Resources"],
  avatar_url: null,
  role: "recruiter",
};

// Job Seeker credentials
export const DEMO_CREDENTIALS = {
  email: "demo@careerbridge.mm",
  password: "demo123",
};

// Recruiter credentials
export const RECRUITER_CREDENTIALS = {
  email: "recruiter@careerbridge.mm",
  password: "recruiter123",
};
