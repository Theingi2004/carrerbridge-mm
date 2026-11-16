
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Menu,
  X,
} from "lucide-react";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { navLinks } from "./nav-links";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

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
        <DesktopNav
          links={navLinks}
          pathname={pathname}
        />

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/login"
            className="text-sm font-semibold text-brand-text transition-colors hover:text-brand-primary "
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="
    flex items-center gap-2
    rounded-lg bg-brand-primary
    px-5 py-3
    text-sm font-semibold text-white
    transition-all duration-200 ease-out
    hover:bg-brand-primary/90
    hover:shadow-md
    active:scale-95
  "
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
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
          {isMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div id="mobile-navigation">
          <MobileNav
            links={navLinks}
            pathname={pathname}
            onClose={closeMenu}
          />
        </div>
      )}
    </header>
  );
}
