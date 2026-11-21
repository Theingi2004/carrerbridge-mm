
"use client";

import Link from "next/link";
import type { NavLink } from "./nav-links";

import {
  ArrowRight,
  UserRound,
  LayoutDashboard,
  BriefcaseBusiness,
  Bookmark,
  Users,
} from "lucide-react";

import LogoutButton from "@/features/auth/LogoutButton";

interface MobileNavProps {
  links: NavLink[];
  pathname: string;
  onClose: () => void;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  fullName: string;
  userRole: string;
}

export default function MobileNav({
  links,
  pathname,
  onClose,
  isAuthenticated,
  isAuthLoading,
  fullName,
  userRole,
}: MobileNavProps) {
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) return "U";

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  return (
    <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-border bg-white px-5 py-6 pb-8 lg:hidden">      {/* Main Navigation */}
      <nav
        aria-label="Mobile navigation"
        className="flex flex-col gap-2"
      >
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : link.href === "/job"
                ? pathname.startsWith("/job")
                : false;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                ? "bg-brand-primary/10 text-brand-primary"
                : "text-brand-text hover:bg-brand-background"
                }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Account Section */}

      {/* Account Section */}
      {!isAuthLoading && (
        <div className="mt-6 border-t border-border pt-5">
          {isAuthenticated ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              {/* User Profile */}
              <div className="flex items-center gap-3 bg-brand-background p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                  {getInitials(fullName)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-brand-text">
                    {fullName}
                  </p>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {userRole.replace("_", " ")}
                  </p>
                </div>
              </div>

              {/* Account Links */}
              <div className="p-2">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-brand-text transition-colors hover:bg-brand-background"
                >
                  <UserRound size={18} className="text-muted-foreground" />
                  My Profile
                </Link>

                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-brand-text transition-colors hover:bg-brand-background"
                >
                  <LayoutDashboard size={18} className="text-muted-foreground" />
                  Dashboard
                </Link>

                {userRole === "job_seeker" && (
                  <>
                    <Link
                      href="/my-applications"
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-brand-text transition-colors hover:bg-brand-background"
                    >
                      <BriefcaseBusiness
                        size={18}
                        className="text-muted-foreground"
                      />
                      My Applications
                    </Link>

                    <Link
                      href="/saved-jobs"
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-brand-text transition-colors hover:bg-brand-background"
                    >
                      <Bookmark
                        size={18}
                        className="text-muted-foreground"
                      />
                      Saved Jobs
                    </Link>
                  </>
                )}

                {userRole === "recruiter" && (
                  <Link
                    href="/dashboard/applicants"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-brand-text transition-colors hover:bg-brand-background"
                  >
                    <Users size={18} className="text-muted-foreground" />
                    My Applicants
                  </Link>
                )}
              </div>

              {/* Logout */}
              <div className="border-t border-border bg-gray-50 p-3">
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={onClose}
                className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-brand-text transition-colors hover:bg-brand-background"
              >
                Log in
              </Link>

              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary/90"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}