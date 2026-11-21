
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Code2,
  Target,
  ArrowRight,
} from "lucide-react";

const resources = [
  {
    title: "Resume Writing",
    description:
      "Learn how to create a professional CV that highlights your skills, projects, and experience.",
    icon: FileText,
    href: "/job",
    linkText: "Explore Jobs",
  },
  {
    title: "Interview Preparation",
    description:
      "Prepare for technical and HR interviews with confidence and improve your communication skills.",
    icon: MessageSquare,
    href: "/job",
    linkText: "Find Opportunities",
  },
  {
    title: "IT Skills Development",
    description:
      "Discover the technical skills and technologies commonly required in today's IT industry.",
    icon: Code2,
    href: "/job",
    linkText: "Explore IT Jobs",
  },
  {
    title: "Career Planning",
    description:
      "Understand different IT career paths and plan your journey toward professional growth.",
    icon: Target,
    href: "/job",
    linkText: "Start Exploring",
  },
];

export default function CareerResources() {
  return (
    <section
      id="career-resources"
      className="scroll-mt-24 bg-brand-background py-20 sm:py-24"
    >
      <div className="container-default">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-secondary">
            Learn and Grow
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Career Resources for Your IT Journey
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Build your knowledge, improve your professional skills,
            and prepare yourself for opportunities in Myanmar's IT industry.
          </p>
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => {
            const Icon = resource.icon;

            return (
              <div
                key={resource.title}
                className="
                  group rounded-2xl border border-border bg-white p-7
                  transition-all duration-300
                  hover:-translate-y-1 hover:border-brand-primary/30
                  hover:shadow-lg
                "
              >
                {/* Icon */}
                <div className="
                  flex size-14 items-center justify-center
                  rounded-2xl bg-brand-primary/10
                  text-brand-primary transition-colors
                  group-hover:bg-brand-primary group-hover:text-white
                ">
                  <Icon size={26} />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-bold text-brand-text">
                  {resource.title}
                </h3>

                <p className="mt-3 min-h-24 text-sm leading-7 text-muted-foreground">
                  {resource.description}
                </p>

                {/* Link */}
                <Link
                  href={resource.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-all hover:gap-3"
                >
                  {resource.linkText}
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}