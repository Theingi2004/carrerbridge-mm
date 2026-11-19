
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getCreatedJobs,
  closeJob,
  reopenJob,
  extendJob,
  deleteJob,
  initializeDemoRecruiterJobs,
} from "../services/job.service";
import { demoRecruiter } from "@/features/auth/data/demo-user";
import type { Job } from "../types/job.types";

export default function MyJobPosts() {
  const [myJobs, setMyJobs] = useState<Job[]>([]);

  const handleCloseJob = (jobId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to close this job?"
    );

    if (!confirmed) return;

    closeJob(jobId, demoRecruiter.id);
    setMyJobs((previousJobs) =>
      previousJobs.map((job) =>
        job.id === jobId
          ? { ...job, status: "closed" }
          : job
      )
    );
  };
  const handleReopenJob = (jobId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to reopen this job?"
    );

    if (!confirmed) return;

    reopenJob(jobId, demoRecruiter.id);
    setMyJobs((previousJobs) =>
      previousJobs.map((job) =>
        job.id === jobId
          ? { ...job, status: "active" }
          : job
      )
    );
  };
  const handleExtendJob = (jobId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to extend this job for another 30 days?"
    );

    if (!confirmed) return;

    extendJob(jobId, demoRecruiter.id);

    // Reload jobs to get the updated expiration date and status.
    const updatedJobs = getCreatedJobs();

    setMyJobs(
      updatedJobs.filter(
        (job) => job.recruiterId === demoRecruiter.id
      )
    );
  };
  const handleDeleteJob = (jobId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      deleteJob(jobId, demoRecruiter.id);

      setMyJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== jobId)
      );

      window.alert("Job deleted successfully.");
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete job."
      );
    }
  };

  useEffect(() => {
    // Step 1: Initialize sample recruiter jobs
    initializeDemoRecruiterJobs();

    // Step 2: Get all stored jobs
    const allJobs = getCreatedJobs();

    // Step 3: Filter jobs belonging to this recruiter
    const recruiterJobs = allJobs.filter(
      (job) => job.recruiterId === demoRecruiter.id
    );

    // Step 4: Update the UI
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
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      {job.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${job.status === "active"
                        ? "bg-green-100 text-green-700"
                        : job.status === "expired"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {job.status === "expired"
                        ? "Expired"
                        : job.status === "active"
                          ? "Active"
                          : "Closed"}
                    </span>
                  </div>

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

                <div className="text-xs text-muted-foreground">
                  <p>
                    Posted: {new Date(job.postedAt).toLocaleDateString()}
                  </p>

                  {job.expiresAt && (
                    <p className="mt-1">
                      Expires: {new Date(job.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Link
                  href={`/dashboard/edit-job/${job.id}`}
                  className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Edit Job
                </Link>

                {job.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => handleCloseJob(job.id)}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Close Job
                  </button>
                ) : job.status === "expired" ? (
                  <button
                    type="button"
                    onClick={() => handleExtendJob(job.id)}
                    className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                  >
                    Extend Job
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleReopenJob(job.id)}
                    className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
                  >
                    Reopen Job
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteJob(job.id)}
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Delete Job
                </button>
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
