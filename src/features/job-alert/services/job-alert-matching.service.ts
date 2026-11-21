
import type { Job } from "@/features/job/types/job.types";
import type { JobAlert } from "../types/job-alert.types";
import type { Notification } from "@/features/notification/types/notification.types";

const ALERTS_STORAGE_KEY = "careerbridge-demo-job-alerts";
const NOTIFICATIONS_STORAGE_KEY = "careerbridge-demo-notifications";

function matchesJobAlert(job: Job, alert: JobAlert): boolean {
  if (!alert.is_active) return false;

  const matches = (
    alertValue: string,
    jobValue: string
  ): boolean => {
    if (!alertValue.trim()) return true;

    return alertValue.trim().toLowerCase() ===
      jobValue.trim().toLowerCase();
  };

  return (
    matches(alert.category, job.category) &&
    matches(alert.location, job.location) &&
    matches(alert.employment_type, job.employmentType) &&
    matches(alert.experience_level, job.experienceLevel)
  );
}

export function createJobAlertNotifications(job: Job): void {
  if (typeof window === "undefined") return;

  if (job.status !== "active") return;

  const storedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY);
  const alerts: JobAlert[] = storedAlerts
    ? JSON.parse(storedAlerts)
    : [];

  const storedNotifications = localStorage.getItem(
    NOTIFICATIONS_STORAGE_KEY
  );

  const notifications: Notification[] = storedNotifications
    ? JSON.parse(storedNotifications)
    : [];

  const now = new Date().toISOString();

  const newNotifications: Notification[] = alerts
    .filter((alert) => matchesJobAlert(job, alert))
    .filter(
      (alert) =>
        !notifications.some(
          (notification) =>
            notification.user_id === alert.user_id &&
            notification.job_id === job.id &&
            notification.type === "job_alert"
        )
    )
    .map((alert) => ({
      id: crypto.randomUUID(),
      user_id: alert.user_id,
      job_id: job.id,
      title: "New Matching Job",
      message: `A new job matches your alert "${alert.name}": ${job.title}.`,
      type: "job_alert",
      link: `/job/${job.id}`,
      is_read: false,
      created_at: now,
    }));

  if (newNotifications.length === 0) return;

  localStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify([...newNotifications, ...notifications])
  );
}
