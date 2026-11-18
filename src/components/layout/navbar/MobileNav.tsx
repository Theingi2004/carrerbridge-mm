
import Link from "next/link";
import type { NavLink } from "./nav-links";
import { ArrowRight } from "lucide-react";

interface MobileNavProps {
  links: NavLink[];
  pathname: string;
  onClose: () => void;
}

export default function MobileNav({
  links,
  pathname,
  onClose,
}: MobileNavProps) {
  return (
    <div className="border-t border-border bg-white px-5 py-6 lg:hidden">
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

      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5">
        <Link
          href="/login"
          onClick={onClose}
          className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold"
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
    </div>
  );
}
