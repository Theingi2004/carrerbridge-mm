
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getCreatedJobs } from "../services/job.service";
import { demoRecruiter } from "@/features/auth/data/demo-user";
import type { Job } from "../types/job.types";

export default function MyJobPosts() {
  const [myJobs, setMyJobs] = useState<Job[]>([]);

  useEffect(() => {
    const allJobs = getCreatedJobs();

    const recruiterJobs = allJobs.filter(
      (job) => job.recruiterId === demoRecruiter.id
    );

    setMyJobs(recruiterJobs);
  }, []);

  return (
    <section className="mt-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-text">
            My Job Posts
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the jobs you have created.
          </p>
        </div>

        <Link
          href="/dashboard/post-job"
          className="rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          + Post a Job
        </Link>
      </div>

      {myJobs.length > 0 ? (
        <div className="space-y-4">
          {myJobs.map((job) => (
            <article
              key={job.id}
              className="rounded-xl border border-border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-brand-text">
                    {job.title}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.company} · {job.location}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary">
                      {job.category}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      {job.employmentType}
                    </span>
                  </div>
                </div>

                <span className="text-xs text-muted-foreground">
                  Posted: {new Date(job.postedAt).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center">
          <h3 className="font-semibold text-brand-text">
            No job posts yet
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Start by creating your first IT job opportunity.
          </p>
        </div>
      )}
    </section>
  );
}
