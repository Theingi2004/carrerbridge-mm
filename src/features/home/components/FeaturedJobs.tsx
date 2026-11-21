
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { featuredJobs } from "../data/featured-jobs";
import JobCard from "./JobCard";
import useSavedJobs from "@/features/job/hooks/useSavedJobs";

export default function FeaturedJobs() {
  const {
    savedJobIds,
    toggleSavedJob,
  } = useSavedJobs();
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-default">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-secondary">
              Explore Opportunities
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
              Featured Jobs
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Discover opportunities from companies looking for
              talented people like you.
            </p>
          </div>

          <Link
            href="/job"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-all duration-200 hover:gap-3"
          >
            View All Jobs
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              onToggleSave={toggleSavedJob}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
