import type { Job } from "../types/job.types";

export const jobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Tech Myanmar",
    location: "Yangon",
    employmentType: "Full-time",
    experienceLevel: "Junior",
    salary: "500,000 - 800,000 MMK",
    postedAt: "2 days ago",
    category: "frontend",
    tags: ["React", "Next.js", "TypeScript"],

    description:
      "We are looking for a motivated Frontend Developer to build modern and responsive web applications.",

    responsibilities: [
      "Build responsive user interfaces using React.",
      "Collaborate with backend developers.",
      "Write clean and maintainable code.",
    ],

    requirements: [
      "Basic knowledge of React and JavaScript.",
      "Understanding of HTML, CSS, and TypeScript.",
      "Good problem-solving skills.",
    ],

    benefits: [
      "Friendly working environment.",
      "Learning and development opportunities.",
      "Career growth opportunities.",
    ],
  },
];