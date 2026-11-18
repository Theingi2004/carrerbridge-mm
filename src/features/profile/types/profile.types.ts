export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfileFormValues {
  full_name: string;
  phone: string;
  headline: string;
  location: string;
  skills: string[];
}