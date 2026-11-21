
"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import useNotifications from "@/features/notification/hooks/useNotifications";

export default function NotificationBell() {
  const { unreadCount, isLoading } = useNotifications();

  return (
    <Link
      href="/notifications"
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-brand-primary dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <Bell size={21} />

      {!isLoading && unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
