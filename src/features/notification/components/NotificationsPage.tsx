
"use client";

import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  CheckCheck,
  Clock,
} from "lucide-react";

import useNotifications from "../hooks/useNotifications";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Bell className="text-brand-primary" size={24} />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Stay updated with jobs that match your alerts.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
            <Bell
              size={40}
              className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
            />

            <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">
              No notifications yet
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              We&apos;ll notify you when new jobs match your job alerts.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border p-5 transition ${notification.is_read
                    ? "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                    : "border-brand-primary/20 bg-brand-primary/[0.04] dark:border-brand-primary/40 dark:bg-brand-primary/10"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-brand-primary/10 p-3 text-brand-primary">
                    <BriefcaseBusiness size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h2>

                      {!notification.is_read && (
                        <span className="rounded-full bg-brand-primary/10 px-2.5 py-1 text-xs font-medium text-brand-primary">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={13} />
                        {new Date(notification.created_at).toLocaleString()}
                      </span>

                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-sm font-semibold text-brand-primary hover:underline"
                        >
                          View job
                        </Link>
                      )}

                      {!notification.is_read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm font-medium text-gray-500 hover:text-brand-primary dark:text-gray-400"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
