
"use client";
import { useState } from "react";
import { ThemeSelect } from "@/components/ui/theme-select";
import type { Applicant, ApplicationStatus } from "../types/application.types";
import ApplicantStatusBadge from "./ApplicantStatusBadge";
type ApplicantCardProps = {
  applicant: Applicant;
  onStatusChange: (
    applicationId: string,
    status: ApplicationStatus
  ) => void;
};

export default function ApplicantCard({
  applicant,
  onStatusChange,
}: ApplicantCardProps) {
  const profile = applicant.profile;
  const job = applicant.job;

  const applicantName = profile?.full_name || "Unknown Applicant";
  const [selectedStatus, setSelectedStatus] = useState(applicant.status);

  const initials = applicantName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
      {/* Applicant Information */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={applicantName}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-lg font-bold text-white">
              {initials}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-brand-text">
              {applicantName}
            </h3>

            <p className="text-sm text-muted-foreground">
              {profile?.headline || "No headline provided"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {profile?.email || "No email provided"}
            </p>
          </div>
        </div>

        <ApplicantStatusBadge status={applicant.status} />
      </div>

      {/* Job Information */}
      <div className="mt-5 rounded-lg bg-gray-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Applied Position
        </p>

        <p className="mt-1 font-semibold text-brand-text">
          {job?.title || "Job information unavailable"}
        </p>

        <p className="text-sm text-muted-foreground">
          {job?.company || "Unknown Company"}
        </p>
      </div>

      {/* Location and Applied Date */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-brand-text">Location:</span>{" "}
          {profile?.location || "Not provided"}
        </p>

        <p>
          <span className="font-medium text-brand-text">Applied:</span>{" "}
          {new Date(applicant.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Skills */}
      {profile?.skills && profile.skills.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-brand-text">
            Skills
          </p>

          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cover Letter */}
      <div className="mt-4">
        <p className="mb-2 text-sm font-semibold text-brand-text">
          Cover Letter
        </p>

        <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
          {applicant.cover_letter || "No cover letter provided."}
        </p>
      </div>

      {/* Status Update */}

      {/* Status Update */}
      <div className="mt-5 border-t border-border pt-4">
        <label
          htmlFor={`status-${applicant.id}`}
          className="mb-2 block text-sm font-medium text-brand-text"
        >
          Update Application Status
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ThemeSelect
            id={`status-${applicant.id}`}
            value={selectedStatus}
            onValueChange={(value) =>
              setSelectedStatus(value as ApplicationStatus)
            }
            className="sm:w-64"
            options={[
              { value: "pending", label: "Pending" },
              { value: "reviewing", label: "Reviewing" },
              { value: "shortlisted", label: "Shortlisted" },
              { value: "rejected", label: "Rejected" },
              { value: "accepted", label: "Accepted" },
            ]}
          />

          <button
            type="button"
            disabled={selectedStatus === applicant.status}
            onClick={() =>
              onStatusChange(applicant.id, selectedStatus)
            }
            className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Status
          </button>
        </div>
      </div>
    </article>
  );
}