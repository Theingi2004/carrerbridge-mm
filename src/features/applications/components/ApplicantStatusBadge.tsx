
import type { ApplicationStatus } from "../types/application.types";

type ApplicantStatusBadgeProps = {
  status: ApplicationStatus;
};

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  reviewing: "bg-blue-100 text-blue-700",
  shortlisted: "bg-purple-100 text-purple-700",
  rejected: "bg-red-100 text-red-700",
  accepted: "bg-green-100 text-green-700",
};

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Pending",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  accepted: "Accepted",
};

export default function ApplicantStatusBadge({
  status,
}: ApplicantStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}