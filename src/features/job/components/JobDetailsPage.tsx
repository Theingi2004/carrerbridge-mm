import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  Clock,
  Banknote,
  Building2,
  CheckCircle2,
} from "lucide-react";

import { jobs } from "../data/jobs";

interface JobDetailsPageProps {
  jobId: string;
}

export default function JobDetailsPage({
  jobId,
}: JobDetailsPageProps) {
  const job = jobs.find((item) => item.id === jobId);

  // Show Next.js 404 page if the job doesn't exist.
  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-background py-10 sm:py-14">
      <div className="container-default">
        <Link
          href="/job"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-colors hover:text-brand-secondary"
        >
          <ArrowLeft size={18} />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <section className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-secondary">
                {job.category}
              </p>

              <h1 className="mt-2 text-2xl font-bold text-brand-text sm:text-3xl">
                {job.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Building2 size={16} />
                  {job.company}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {job.location}
                </span>
              </div>
            </div>

            <span className="w-fit rounded-full bg-brand-primary/10 px-4 py-2 text-sm font-semibold text-brand-primary">
              {job.employmentType}
            </span>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
            <JobInfo
              icon={<BriefcaseBusiness size={18} />}
              label="Experience"
              value={job.experienceLevel}
            />

            <JobInfo
              icon={<Banknote size={18} />}
              label="Salary"
              value={job.salary}
            />

            <JobInfo
              icon={<Clock size={18} />}
              label="Posted"
              value={job.postedAt}
            />
          </div>
        </section>

        {/* Job Content */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ContentSection title="Job Description">
              <p className="text-sm leading-7 text-muted-foreground">
                {job.description || "Job description will be available soon."}
              </p>
            </ContentSection>

            <ContentSection title="Responsibilities">
              <DetailList items={job.responsibilities ?? []} />
            </ContentSection>

            <ContentSection title="Requirements">
              <DetailList items={job.requirements ?? []} />
            </ContentSection>

            <ContentSection title="Benefits">
              <DetailList items={job.benefits ?? []} />
            </ContentSection>
          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-brand-text">
              Interested in this position?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The job application feature will be available in a later milestone.
            </p>

            <Link
              href={`/job/${job.id}/apply`}
              className="mt-5 block w-full rounded-lg bg-brand-primary px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-brand-primary/90 hover:shadow-md active:scale-95"
            >
              Apply Now
            </Link>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Job ID: {job.id}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

// Reusable job information item
function JobInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="rounded-lg bg-brand-primary/10 p-2 text-brand-primary">
        {icon}
      </span>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-semibold text-brand-text">
          {value}
        </p>
      </div>
    </div>
  );
}

// Reusable content section
function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-bold text-brand-text">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

// Reusable bullet list
function DetailList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Information will be available soon.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-brand-primary"
          />
          <span className="text-sm leading-6 text-muted-foreground">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}