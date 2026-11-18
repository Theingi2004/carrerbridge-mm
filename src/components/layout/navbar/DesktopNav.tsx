
import Link from "next/link";
import type { NavLink } from "./nav-links";

interface DesktopNavProps {
  links: NavLink[];
  pathname: string;
}

export default function DesktopNav({
  links,
  pathname,
}: DesktopNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-8 lg:flex"
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
            aria-current={isActive ? "page" : undefined}
            className={`text-sm font-medium transition-colors duration-200 ${isActive
                ? "text-brand-primary"
                : "text-muted-foreground hover:text-brand-primary"
              }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
