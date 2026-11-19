
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  ArrowRight,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

const highlights = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To connect Myanmar IT students, fresh graduates, and junior developers with meaningful career opportunities.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To become a trusted career platform that supports the growth of Myanmar's IT talent and technology industry.",
  },
  {
    icon: Heart,
    title: "Our Commitment",
    description:
      "To make IT career opportunities more accessible and help young professionals build successful futures.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-white py-20 sm:py-24"
    >
      <div className="container-default">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">

          {/* Left Content */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-secondary">
              About CareerBridge MM
            </p>

            <h2 className="text-3xl font-bold leading-tight tracking-tight text-brand-text sm:text-4xl">
              Building a Stronger Future for Myanmar's IT Talent
            </h2>

            <p className="mt-6 text-sm leading-8 text-muted-foreground sm:text-base">
              CareerBridge MM is an IT-focused career platform designed
              to help students, fresh graduates, and junior developers
              discover job and internship opportunities in Myanmar.
            </p>

            <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
              We aim to make the job search journey easier by connecting
              aspiring IT professionals with employers and helping them
              take meaningful steps toward their careers.
            </p>

            <Link
              href="/job"
              className="
                mt-8 inline-flex items-center gap-2
                rounded-lg bg-brand-primary px-7 py-3.5
                text-sm font-semibold text-white
                transition-all duration-200
                hover:bg-brand-primary/90 hover:shadow-md
                active:scale-95
              "
            >
              Explore Opportunities
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right Content */}
          <div className="grid gap-5">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    flex gap-5 rounded-2xl border border-border
                    bg-brand-background p-6
                    transition-all duration-300
                    hover:border-brand-primary/30 hover:shadow-md
                  "
                >
                  <div className="
                    flex size-12 shrink-0 items-center justify-center
                    rounded-xl bg-brand-primary text-white
                  ">
                    <Icon size={23} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-text">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Highlights */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-center gap-5 rounded-2xl bg-brand-primary p-7 text-white">
            <Users size={36} className="shrink-0" />

            <div>
              <h3 className="text-lg font-bold">
                For IT Job Seekers
              </h3>

              <p className="mt-1 text-sm leading-6 text-white/75">
                Discover opportunities and showcase your professional skills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-2xl bg-brand-secondary p-7 text-white">
            <BriefcaseBusiness size={36} className="shrink-0" />

            <div>
              <h3 className="text-lg font-bold">
                For Employers
              </h3>

              <p className="mt-1 text-sm leading-6 text-white/85">
                Connect with aspiring IT professionals and discover new talent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}