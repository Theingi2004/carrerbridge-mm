export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salary: string;
  postedAt: string;
  category: string;
  tags: string[];

  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}