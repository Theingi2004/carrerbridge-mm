
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  MapPin,
} from "lucide-react";

import type { Job } from "../types/job.types";

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
}
export default function JobCard({
  job,
  isSaved,
  onToggleSave,
}: JobCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
          <BriefcaseBusiness size={23} />
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
            {job.employmentType}
          </span>
          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            aria-label={isSaved ? "Remove saved job" : "Save job"}
            aria-pressed={isSaved}
            className={`flex size-9 items-center justify-center rounded-full border transition-colors ${isSaved
              ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
              : "border-border text-muted-foreground hover:border-brand-primary hover:text-brand-primary"
              }`}
          >
            <Bookmark
              size={18}
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-bold text-brand-text transition-colors group-hover:text-brand-primary">
          {job.title}
        </h3>

        <p className="mt-1 text-sm font-medium text-muted-foreground">
          {job.company}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} />
          {job.location}
        </span>

        <span className="flex items-center gap-1.5">
          <Clock3 size={14} />
          {job.experienceLevel}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-brand-background px-2.5 py-1.5 text-xs font-medium text-brand-text"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-5 mt-6">
        <div>
          <p className="text-xs text-muted-foreground">Salary</p>
          <p className="mt-1 text-sm font-semibold text-brand-text">
            {job.salary}
          </p>
        </div>

        <Link
          href={`/job/${job.id}`}
          aria-label={`View ${job.title} at ${job.company}`}
          className="flex size-10 items-center justify-center rounded-full border border-border text-brand-primary transition-all duration-200 hover:bg-brand-primary hover:text-white active:scale-95"
        >
          <ArrowUpRight size={19} />
        </Link>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Posted {job.postedAt}
      </p>
    </article>
  );
}
