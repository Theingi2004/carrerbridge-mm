
import Link from "next/link";
import {
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Find Jobs", href: "/job" },
    { label: "Career Resources", href: "/#career-resources" },
    { label: "About Us", href: "/#about" },
  ],
  account: [
    { label: "Create Account", href: "/register" },
    { label: "Log In", href: "/login" },
    { label: "My Dashboard", href: "/dashboard" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#142C25] text-white">
      <div className="container-default">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                <BriefcaseBusiness size={23} />
              </div>

              <div>
                <p className="text-xl font-bold">CareerBridge</p>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-brand-secondary">
                  MYANMAR
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              Connecting Myanmar&apos;s young talent with
              meaningful IT career opportunities.
              Build your skills, discover opportunities,
              and grow your future.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-10 items-center justify-center rounded-lg bg-white/10 transition-all hover:bg-white/20 active:scale-95"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />
                </svg>

              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex size-10 items-center justify-center rounded-lg bg-white/10 transition-all hover:bg-white/20 active:scale-95"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.37 4.28 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                </svg>

              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-bold">Platform</h3>

            <ul className="mt-5 space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-sm font-bold">For Job Seekers</h3>

            <ul className="mt-5 space-y-4">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-5">
            <span className="flex items-center gap-2 text-xs text-white/60">
              <Mail size={15} />
              hello@careerbridgemm.com
            </span>

            <span className="flex items-center gap-2 text-xs text-white/60">
              <MapPin size={15} />
              Myanmar
            </span>
          </div>

          <span className="flex items-center gap-2 text-xs text-white/60">
            <Phone size={15} />
            Contact information coming soon
          </span>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
          © 2026 CareerBridge MM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
