
import Link from "next/link";
import {
  ArrowRight,
  Search,
  BriefcaseBusiness,
} from "lucide-react";

const popularCategories = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Internship",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-background py-20 sm:py-28">
      <div className="container-default">
        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-primary/15 bg-white px-4 py-2">
            <BriefcaseBusiness
              size={16}
              className="text-brand-primary"
            />
            <span className="text-sm font-medium text-brand-primary">
              Your Career Starts Here
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-brand-text sm:text-5xl lg:text-6xl">
            Find Your Future in
            <span className="text-brand-primary">
              {" "}Myanmar's IT Industry
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Discover IT jobs, internships, and career opportunities.
            Connect with employers and take the next step in your
            professional journey.
          </p>

          {/* Search Form */}
          <form
            action="/jobs"
            method="GET"
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-white p-3 shadow-lg sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search
                size={21}
                className="shrink-0 text-muted-foreground"
              />

              <input
                type="search"
                name="q"
                placeholder="Job title, skill, or company..."
                aria-label="Search jobs"
                className="h-12 w-full bg-transparent text-sm text-brand-text outline-none placeholder:text-muted-foreground"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-7 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out cursor-pointer hover:shadow-md active:scale-95"
            >
              Search Jobs
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Popular Categories */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Popular:
            </span>

            {popularCategories.map((category) => (
              <Link
                key={category}
                href={`/jobs?category=${encodeURIComponent(category)}`}
                className="rounded-full border border-border bg-white px-4 py-2 text-xs font-medium text-brand-text transition-all duration-200 hover:border-brand-primary hover:text-brand-primary active:scale-95"
              >
                {category}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
