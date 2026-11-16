
import {
  Code2,
  Database,
  Palette,
  Smartphone,
  BarChart3,
  Cloud,
} from "lucide-react";

import type { JobCategory } from "../types/category.types";

export const jobCategories: JobCategory[] = [
  {
    id: "1",
    title: "Frontend Development",
    description: "Build beautiful and interactive web experiences.",
    icon: Code2,
    slug: "frontend",
  },
  {
    id: "2",
    title: "Backend Development",
    description: "Build APIs, databases, and server-side systems.",
    icon: Database,
    slug: "backend",
  },
  {
    id: "3",
    title: "UI/UX Design",
    description: "Create meaningful and user-friendly designs.",
    icon: Palette,
    slug: "ui-ux",
  },
  {
    id: "4",
    title: "Mobile Development",
    description: "Create applications for mobile devices.",
    icon: Smartphone,
    slug: "mobile",
  },
  {
    id: "5",
    title: "Data & Analytics",
    description: "Turn data into useful business insights.",
    icon: BarChart3,
    slug: "data",
  },
  {
    id: "6",
    title: "DevOps & Cloud",
    description: "Manage infrastructure and deployment workflows.",
    icon: Cloud,
    slug: "devops",
  },
];
