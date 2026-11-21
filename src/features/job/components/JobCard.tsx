
import Link from "next/link";
import type { Job } from "../types/job.types";

type JobCardProps = {
  job: Job;
  onClose: (jobId: string) => void;
  onReopen: (jobId: string) => void;
  onExtend: (jobId: string) => void;
  onDelete: (jobId: string) => void;
};

export default function JobCard({
  job,
  onClose,
  onReopen,
  onExtend,
  onDelete,
}: JobCardProps) {
  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
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

      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <Link
          href={`/dashboard/edit-job/${job.id}`}
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Edit Job
        </Link>

        {job.status === "active" ? (
          <button
            type="button"
            onClick={() => onClose(job.id)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Close Job
          </button>
        ) : job.status === "expired" ? (
          <button
            type="button"
            onClick={() => onExtend(job.id)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Extend Job
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onReopen(job.id)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Reopen Job
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(job.id)}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete Job
        </button>
      </div>
    </article>
  );
}
