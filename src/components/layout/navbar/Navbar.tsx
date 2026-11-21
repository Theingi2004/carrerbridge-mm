
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Menu,
  X,
  UserRound,
  LayoutDashboard,
  Users,
  BellRing,
} from "lucide-react";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { navLinks } from "./nav-links";

import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/client";
import { demoUser, demoRecruiter } from "@/features/auth/data/demo-user";
import LogoutButton from "@/features/auth/LogoutButton";
import NotificationBell from "@/features/job-alert/components/NotificationBell";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

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

  useEffect(() => {
    setIsDropdownOpen(false);

    if (isDemoMode) {
      const hasDemoSession = document.cookie
        .split("; ")
        .some((cookie) => cookie === "careerbridge_demo_session=true");

      const roleCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("careerbridge_demo_role="));

      const role = roleCookie?.split("=")[1];

      const user =
        role === "recruiter" ? demoRecruiter : demoUser;

      setIsAuthenticated(hasDemoSession);
      setFullName(hasDemoSession ? user.full_name : "");
      setUserRole(hasDemoSession ? role || "" : "");
      setIsAuthLoading(false);
      return;
    }

    const supabase = createClient();

    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name,role")
          .eq("id", user.id)
          .single();

        setIsAuthenticated(true);
        setFullName(
          profile?.full_name ||
          user.user_metadata?.full_name ||
          user.email ||
          "User"
        );
        setUserRole(profile?.role || user.user_metadata?.role || "");
      } else {
        setIsAuthenticated(false);
        setFullName("");
        setUserRole("");
      }

      setIsAuthLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md">
      <div className="container-default flex h-20 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="CareerBridge MM home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-primary text-white">
            <BriefcaseBusiness size={22} />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-brand-primary">
              CareerBridge
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-brand-secondary">
              MYANMAR
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav links={navLinks} pathname={pathname} />

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 lg:flex">
          {!isAuthLoading &&
            (isAuthenticated ? (
              <div className="flex items-center gap-3">
                <NotificationBell />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsDropdownOpen((prev) => !prev)
                    }
                    aria-expanded={isDropdownOpen}
                    aria-label="Open account menu"
                    className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white transition-colors hover:bg-brand-primary/90"
                  >
                    {getInitials(fullName)}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-2/3 top-full z-50 mt-3 w-60 -translate-x-2/3 rounded-xl border border-border bg-white p-2 shadow-lg">
                      <div className="border-b border-border px-3 py-3">
                        <p className="truncate text-sm font-semibold text-brand-text">
                          {fullName}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-brand-text hover:bg-brand-background"
                      >
                        <UserRound size={18} />
                        My Profile
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-brand-text hover:bg-brand-background"
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>

                      {userRole === "job_seeker" && (
                        <>
                          <Link
                            href="/my-applications"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-brand-text hover:bg-brand-background"
                          >
                            <BriefcaseBusiness size={18} />
                            My Applications
                          </Link>

                          <Link
                            href="/saved-jobs"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-brand-text hover:bg-brand-background"
                          >
                            <Bookmark size={18} />
                            Saved Jobs
                          </Link>
                          <Link
                            href="/job-alerts"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-brand-text hover:bg-brand-background"
                          >
                            <BellRing size={18} />
                            Job Alerts
                          </Link>
                        </>
                      )}

                      {userRole === "recruiter" && (
                        <Link
                          href="/dashboard/applicants"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-brand-text hover:bg-brand-background"
                        >
                          <Users size={18} />
                          My Applicants
                        </Link>
                      )}

                      <div className="border-t border-border pt-2">
                        <LogoutButton />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-brand-text transition-colors hover:text-brand-primary"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-brand-primary/90 hover:shadow-md active:scale-95"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className="flex size-10 items-center justify-center rounded-lg border border-border text-brand-primary transition-colors hover:bg-brand-background lg:hidden"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div id="mobile-navigation">
          <MobileNav
            links={navLinks}
            pathname={pathname}
            onClose={closeMenu}
            isAuthenticated={isAuthenticated}
            isAuthLoading={isAuthLoading}
            fullName={fullName}
            userRole={userRole}
          />
        </div>
      )}
    </header>
  );
}
