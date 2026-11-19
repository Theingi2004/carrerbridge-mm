
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ApplyJobForm from "./ApplyJobForm";
import { jobs } from "@/features/job/data/jobs";
import { getCreatedJobs } from "@/features/job/services/job.service";

import type { Job } from "@/features/job/types/job.types";

interface DemoApplyJobPageProps {
  jobId: string;
  userId: string;
}

export default function DemoApplyJobPage({
  jobId,
  userId,
}: DemoApplyJobPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sampleJob = jobs.find((item) => item.id === jobId);

    const createdJob = getCreatedJobs().find(
      (item) => item.id === jobId
    );

    const foundJob = createdJob ?? sampleJob;

    if (createdJob?.status === "closed") {
      setJob(null);
    } else {
      setJob(foundJob ?? null);
    }

    setIsLoading(false);
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="container-default py-12">
        Loading application form...
      </div>
    );
  }

  if (!job) {
    return (
      <main className="container-default py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-text">
          Job Not Found
        </h1>

        <p className="mt-3 text-muted-foreground">
          This job may no longer be available.
        </p>

        <Link
          href="/job"
          className="mt-6 inline-block rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Jobs
        </Link>
      </main>
    );
  }

  return (
    <main className="container-default min-h-screen py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-brand-secondary">
            Job Application
          </p>

          <h1 className="mt-2 text-3xl font-bold text-brand-text">
            Apply for {job.title}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {job.company} · {job.location}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <ApplyJobForm jobId={job.id} userId={userId} />
        </div>
      </div>
    </main>
  );
}