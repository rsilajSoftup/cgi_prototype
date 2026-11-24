"use client";

import { ShieldPlus } from "lucide-react";
import Link from "next/link";

import { AccessibilitySettings } from "@/components/accessibility/accessibility-settings";
import { AssistantHeaderButton } from "@/components/claim/assistant-dock";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/claim/insurance", label: "Start a claim" },
  { href: "/track", label: "Track a claim" },
];

export function SiteHeader() {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-foreground hover:text-primary focus-visible:ring-ring flex min-h-11 items-center gap-2 rounded-md text-base font-semibold tracking-tight focus-visible:ring-3 focus-visible:outline-none"
        >
          <ShieldPlus className="size-6 shrink-0" aria-hidden="true" />
          <span>Health Claim Service</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium focus-visible:ring-3 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <AccessibilitySettings />
          <AssistantHeaderButton />
        </div>
      </div>
    </header>
  );
}
