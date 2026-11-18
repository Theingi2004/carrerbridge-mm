
import type { Application } from "../types/application.types";
import ApplicationStatus from "./ApplicationStatus";

interface Props {
  application: Application;
}

export default function ApplicationCard({
  application,
}: Props) {
  const appliedDate = new Date(
    application.created_at
  ).toLocaleDateString();

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-foreground">
            Job Application
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Job ID: {application.job_id}
          </p>
        </div>

        <ApplicationStatus status={application.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p className="text-muted-foreground">
          Applied on: {appliedDate}
        </p>

        <div>
          <p className="font-medium text-foreground">
            Cover Letter
          </p>

          <p className="mt-1 text-muted-foreground">
            {application.cover_letter || "No cover letter provided."}
          </p>
        </div>
      </div>
    </article>
  );
}