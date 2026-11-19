
import type { Job } from "../types/job.types";

export const demoRecruiterJobs: Job[] = [
  {
    id: "demo-job-001",
    recruiterId: "demo-recruiter-001",
    title: "Junior Frontend Developer",
    company: "ABC Technology",
    location: "Yangon, Myanmar",
    employmentType: "Full-time",
    experienceLevel: "Junior",
    salary: "400,000 - 600,000 MMK",
    postedAt: new Date().toISOString(),
    expiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    category: "Frontend Development",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    status: "active",
    description:
      "We are looking for a Junior Frontend Developer to build responsive and user-friendly web applications.",
    responsibilities: [
      "Develop responsive web interfaces using React and Next.js.",
      "Collaborate with backend developers and designers.",
      "Write clean and maintainable code.",
      "Fix bugs and improve application performance.",
    ],
    requirements: [
      "Basic knowledge of React and JavaScript.",
      "Understanding of HTML, CSS, and responsive design.",
      "Familiarity with Git and GitHub.",
      "Willingness to learn new technologies.",
    ],
    benefits: [
      "Friendly working environment.",
      "Professional development opportunities.",
      "Mentorship from senior developers.",
    ],
  },
  {
    id: "demo-job-002",
    recruiterId: "demo-recruiter-001",
    title: "Backend Developer",
    company: "ABC Technology",
    location: "Yangon, Myanmar",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salary: "700,000 - 1,000,000 MMK",
    postedAt: new Date().toISOString(),
    expiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    category: "Backend Development",
    tags: ["Laravel", "PHP", "MySQL", "REST API"],
    status: "active",
    description:
      "We are hiring a Backend Developer to develop and maintain reliable server-side applications and APIs.",
    responsibilities: [
      "Develop backend features using Laravel and PHP.",
      "Design and maintain REST APIs.",
      "Work with relational databases.",
      "Collaborate with frontend developers.",
    ],
    requirements: [
      "Experience with PHP and Laravel.",
      "Knowledge of MySQL.",
      "Understanding of REST API development.",
      "Problem-solving skills.",
    ],
    benefits: [
      "Competitive salary.",
      "Technical training opportunities.",
      "Career growth opportunities.",
    ],
  },
  {
    id: "demo-job-003",
    recruiterId: "demo-recruiter-001",
    title: "Full Stack Developer Intern",
    company: "ABC Technology",
    location: "Yangon, Myanmar",
    employmentType: "Internship",
    experienceLevel: "Entry Level",
    salary: "200,000 - 300,000 MMK",
    postedAt: new Date().toISOString(),
    expiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    category: "Full Stack Development",
    tags: ["React", "Node.js", "JavaScript", "MySQL"],
    status: "active",
    description:
      "An opportunity for students and fresh graduates to gain practical full stack development experience.",
    responsibilities: [
      "Assist in developing web application features.",
      "Work with frontend and backend technologies.",
      "Participate in code reviews.",
      "Learn from experienced developers.",
    ],
    requirements: [
      "Basic knowledge of JavaScript.",
      "Familiarity with React or another frontend framework.",
      "Basic understanding of databases.",
      "Strong willingness to learn.",
    ],
    benefits: [
      "Hands-on project experience.",
      "Mentorship and technical guidance.",
      "Potential full-time employment opportunity.",
    ],
  },
  {
    id: "demo-job-004",
    recruiterId: "demo-recruiter-001",
    title: "UI/UX Designer",
    company: "ABC Technology",
    location: "Remote",
    employmentType: "Part-time",
    experienceLevel: "Junior",
    salary: "300,000 - 500,000 MMK",
    postedAt: new Date().toISOString(),
    expiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    category: "UI/UX Design",
    tags: ["Figma", "Wireframing", "Prototyping", "UI Design"],
    status: "active",
    description:
      "We are looking for a creative UI/UX Designer to help create intuitive and attractive digital experiences.",
    responsibilities: [
      "Create wireframes and interactive prototypes.",
      "Design user-friendly interfaces.",
      "Collaborate with developers.",
      "Improve designs based on feedback.",
    ],
    requirements: [
      "Knowledge of Figma.",
      "Understanding of UI/UX principles.",
      "Basic knowledge of responsive design.",
      "A portfolio of design work is preferred.",
    ],
    benefits: [
      "Flexible working hours.",
      "Remote working opportunity.",
      "Creative and collaborative environment.",
    ],
  },
  {
    id: "demo-job-005",
    recruiterId: "demo-recruiter-001",
    title: "QA Engineer",
    company: "ABC Technology",
    location: "Mandalay, Myanmar",
    employmentType: "Full-time",
    experienceLevel: "Junior",
    salary: "400,000 - 600,000 MMK",
    postedAt: new Date().toISOString(),
    expiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    category: "Quality Assurance",
    tags: ["Manual Testing", "Test Cases", "Bug Tracking"],
    status: "active",
    description:
      "Join our team as a QA Engineer and help ensure the quality and reliability of our web applications.",
    responsibilities: [
      "Test web application features.",
      "Write and execute test cases.",
      "Identify and report bugs.",
      "Collaborate with developers to resolve issues.",
    ],
    requirements: [
      "Understanding of software testing concepts.",
      "Knowledge of manual testing.",
      "Attention to detail.",
      "Good communication skills.",
    ],
    benefits: [
      "Professional training.",
      "Supportive team environment.",
      "Career development opportunities.",
    ],
  },
];