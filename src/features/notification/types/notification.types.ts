
export type NotificationType = "job_alert" | "application";

export interface Notification {
  id: string;
  user_id: string;
  job_id: string | null;
  title: string;
  message: string;
  type: NotificationType;
  link: string | null;
  is_read: boolean;
  created_at: string;
}
