
export interface JobAlert {
  id: string;
  user_id: string;

  name: string;

  category: string;
  location: string;
  employment_type: string;
  experience_level: string;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface CreateJobAlertInput {
  name: string;

  category?: string;
  location?: string;
  employment_type?: string;
  experience_level?: string;
}
