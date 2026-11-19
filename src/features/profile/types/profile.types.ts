
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  bio: string;
  skills: string[];
  avatar_url: string | null;
}

export interface UpdateProfileInput {
  full_name: string;
  phone: string;
  location: string;
  headline: string;
  bio: string;
  skills: string[];
  avatar_url: string | null;
}