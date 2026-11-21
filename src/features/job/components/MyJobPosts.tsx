
"use client";

import Link from "next/link";

import JobCard from "./JobCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import useMyJobs from "../hooks/useMyJobs";

export default function MyJobPosts() {
  const {
    myJobs,
    isConfirmOpen,
    confirmTitle,
    confirmMessage,
    handleCloseJob,
    handleReopenJob,
    handleExtendJob,
    handleDeleteJob,
    handleConfirm,
    handleCancel,
  } = useMyJobs();

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
            <JobCard
              key={job.id}
              job={job}
              onClose={handleCloseJob}
              onReopen={handleReopenJob}
              onExtend={handleExtendJob}
              onDelete={handleDeleteJob}
            />
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

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </section>
  );
}