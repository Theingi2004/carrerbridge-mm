
import Link from "next/link";
import {
  UserRoundPlus,
  Search,
  Send,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Create Your Profile",
    description:
      "Sign up and build your professional profile. Showcase your skills, experience, and career interests.",
    icon: UserRoundPlus,
  },
  {
    id: "02",
    title: "Discover Opportunities",
    description:
      "Explore IT jobs and internships that match your skills, interests, and career goals.",
    icon: Search,
  },
  {
    id: "03",
    title: "Apply for Jobs",
    description:
      "Submit your applications and track your progress as you move toward your next opportunity.",
    icon: Send,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-default">

        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-secondary">
            Simple Process
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Start Your Career in Three Easy Steps
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Your next career opportunity is closer than you think.
            Follow these simple steps to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="
                  group relative rounded-2xl border border-border
                  bg-brand-background p-8
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:border-brand-primary/30
                  hover:shadow-lg
                "
              >
                {/* Number */}
                <span className="absolute right-7 top-7 text-4xl font-bold text-brand-primary/10">
                  {step.id}
                </span>

                {/* Icon */}
                <div className="
                  flex size-14 items-center justify-center
                  rounded-2xl bg-brand-primary text-white
                  transition-transform duration-300
                  group-hover:scale-110
                ">
                  <Icon size={26} />
                </div>

                {/* Content */}
                <h3 className="mt-7 text-xl font-bold text-brand-text">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="
              inline-flex items-center justify-center gap-2
              rounded-lg bg-brand-primary px-7 py-3.5
              text-sm font-semibold text-white
              transition-all duration-200 ease-out
              hover:shadow-md
              active:scale-95
            "
          >
            Get Started Today
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
