
"use client";

import { useEffect, useState } from "react";

import { getApplicationsForRecruiter } from "../services/application.service";
import { demoRecruiter } from "@/features/auth/data/demo-user";

import type { Application } from "../types/application.types";
import { updateApplicationStatus } from "../services/application.service";
import type { ApplicationStatus } from "../types/application.types";
export default function RecruiterApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await getApplicationsForRecruiter(
          demoRecruiter.id
        );

        setApplications(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load applications."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleStatusChange = async (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    try {
      await updateApplicationStatus(applicationId, status);

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? { ...application, status }
            : application
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update application status."
      );
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading applications...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <section className="mt-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-brand-text">
          Job Applications
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Review applications submitted for your jobs.
        </p>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rounded-xl border border-border bg-white p-5"
            >
              <p className="font-semibold text-brand-text">
                Application ID: {application.id}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Job ID: {application.job_id}
              </p>

              <div className="mt-3">
                <label
                  htmlFor={`status-${application.id}`}
                  className="mb-2 block text-sm font-medium"
                >
                  Application Status
                </label>

                <select
                  id={`status-${application.id}`}
                  value={application.status}
                  onChange={(event) =>
                    handleStatusChange(
                      application.id,
                      event.target.value as ApplicationStatus
                    )
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {application.cover_letter || "No cover letter provided."}
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                Applied: {new Date(application.created_at).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="font-medium text-brand-text">
            No applications yet
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Applications for your posted jobs will appear here.
          </p>
        </div>
      )}
    </section>
  );
}