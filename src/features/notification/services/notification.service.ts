
import type { Notification } from "../types/notification.types";

import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/client";
import {
  demoUser,
  demoRecruiter,
} from "@/features/auth/data/demo-user";

const STORAGE_KEY = "careerbridge-demo-notifications";

function getCurrentUserId(): string | null {
  if (!isDemoMode || typeof document === "undefined") {
    return null;
  }

  const role = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("careerbridge_demo_role="))
    ?.split("=")[1];

  if (role === "job_seeker") return demoUser.id;
  if (role === "recruiter") return demoRecruiter.id;

  return null;
}

export async function getNotifications(): Promise<Notification[]> {
  if (isDemoMode) {
    if (typeof window === "undefined") return [];

    const userId = getCurrentUserId();

    if (!userId) return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    const notifications: Notification[] = stored
      ? JSON.parse(stored)
      : [];

    return notifications
      .filter((notification) => notification.user_id === userId)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
  }

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Notification[];
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  if (isDemoMode) {
    const userId = getCurrentUserId();

    if (!userId) {
      throw new Error("Please log in to update notifications.");
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const notifications: Notification[] = stored
      ? JSON.parse(stored)
      : [];

    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId &&
        notification.user_id === userId
        ? { ...notification, is_read: true }
        : notification
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedNotifications)
    );

    return;
  }

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Please log in.");

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  if (isDemoMode) {
    const userId = getCurrentUserId();

    if (!userId) {
      throw new Error("Please log in to update notifications.");
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const notifications: Notification[] = stored
      ? JSON.parse(stored)
      : [];

    const updatedNotifications = notifications.map((notification) =>
      notification.user_id === userId
        ? { ...notification, is_read: true }
        : notification
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedNotifications)
    );

    return;
  }

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Please log in.");

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) throw error;
}
