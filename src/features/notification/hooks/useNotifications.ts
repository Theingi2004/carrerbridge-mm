
"use client";

import { useCallback, useEffect, useState } from "react";

import type { Notification } from "../types/notification.types";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.service";

const NOTIFICATIONS_UPDATED_EVENT = "careerbridge:notifications-updated";

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load notifications."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    const handleNotificationsUpdated = () => {
      void loadNotifications();
    };

    window.addEventListener(
      NOTIFICATIONS_UPDATED_EVENT,
      handleNotificationsUpdated
    );

    return () => {
      window.removeEventListener(
        NOTIFICATIONS_UPDATED_EVENT,
        handleNotificationsUpdated
      );
    };
  }, [loadNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      setError("");

      await markNotificationAsRead(notificationId);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      window.dispatchEvent(
        new Event(NOTIFICATIONS_UPDATED_EVENT)
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update notification.";

      setError(message);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      setError("");

      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      window.dispatchEvent(
        new Event(NOTIFICATIONS_UPDATED_EVENT)
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update notifications.";

      setError(message);
      throw error;
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  };
}
