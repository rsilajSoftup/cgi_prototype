import Link from "next/link";

import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n/config";

export function SiteFooter() {
  return (
    <footer className="border-border bg-card mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-2">
          <p className="text-foreground text-sm font-semibold">
            Health Claim Service
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A demonstration of an accessible digital health insurance claim
            journey. Not a real insurance product.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-foreground text-sm font-semibold">Languages</p>
          <p className="text-muted-foreground text-sm">
            {SUPPORTED_LOCALES.map((locale) => LOCALE_LABELS[locale]).join(
              " · ",
            )}
          </p>
          <p className="text-muted-foreground text-sm">
            Use Accessibility in the header to change language, text size,
            contrast and simplified layout. Claim answers stay as you entered
            them.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/"
                className="text-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/track"
                className="text-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
              >
                Track a demonstration claim
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
