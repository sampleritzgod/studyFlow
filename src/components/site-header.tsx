"use client";

import Link from "next/link";
import { SignInButton, SignOutButton, UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const appLinks = [
  { href: "/notes", label: "Notes" },
  { href: "/focus", label: "Focus" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/outreach", label: "Outreach" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const hideChrome = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (hideChrome) return null;

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-logo" href="/">
          StudyFlow
        </Link>

        {isSignedIn ? (
          <>
            <nav className="site-nav" aria-label="Main">
              {appLinks.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={active ? "site-nav-link is-active" : "site-nav-link"}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="site-header-actions">
              <Link
                className={
                  pathname === "/dashboard" ? "site-nav-link is-active" : "site-nav-link"
                }
                href="/dashboard"
              >
                Home
              </Link>
              <UserButton />
              <SignOutButton>
                <button className="button button-secondary button-compact" type="button">
                  Sign out
                </button>
              </SignOutButton>
            </div>
          </>
        ) : (
          <div className="site-header-actions">
            <SignInButton mode="redirect">
              <button className="button button-secondary button-compact" type="button">
                Sign in
              </button>
            </SignInButton>
            <Link className="button button-primary button-compact" href="/sign-up">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
