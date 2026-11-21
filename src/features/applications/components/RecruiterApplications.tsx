
"use client";

import { useState } from "react";

import useRecruiterApplicants from "../hooks/useRecruiterApplicants";
import ApplicantCard from "./ApplicantCard";

import { updateApplicationStatus } from "../services/application.service";

import type { ApplicationStatus } from "../types/application.types";

export default function RecruiterApplications() {
  const {
    applicants,
    isLoading,
    error,
    setApplicants,
  } = useRecruiterApplicants();

  const [updateError, setUpdateError] = useState("");

  const handleStatusChange = async (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    try {
      setUpdateError("");

      await updateApplicationStatus(applicationId, status);

      setApplicants((currentApplicants) =>
        currentApplicants.map((applicant) =>
          applicant.id === applicationId
            ? { ...applicant, status }
            : applicant
        )
      );
    } catch (error) {
      setUpdateError(
        error instanceof Error
          ? error.message
          : "Failed to update application status."
      );
    }
  };

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading applicants...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        {error}
      </p>
    );
  }

  const pendingCount = applicants.filter(
    (applicant) => applicant.status === "pending"
  ).length;

  return (
    <section className="mt-8">
      {/* Page Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-brand-text">
          Job Applicants
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage applications submitted for your jobs.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">
            Total Applicants
          </p>

          <p className="mt-2 text-2xl font-bold text-brand-text">
            {applicants.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">
            Pending Review
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-600">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Status Update Error */}
      {updateError && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {updateError}
        </p>
      )}

      {/* Applicant List */}
      {applicants.length > 0 ? (
        <div className="space-y-5">
          {applicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center">
          <h3 className="font-semibold text-brand-text">
            No applicants yet
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Applications for your posted jobs will appear here.
          </p>
        </div>
      )}
    </section>
  );
}