import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";

import { AssistantDock } from "@/components/claim/assistant-dock";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { AssistantProvider } from "@/components/providers/assistant-provider";
import { ClaimFormProvider } from "@/components/providers/claim-form-provider";
import { PreferencesProvider } from "@/components/providers/preferences-provider";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { DEFAULT_PREFERENCES } from "@/lib/preferences/defaults";

import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "Health Claim Service",
    template: "%s · Health Claim Service",
  },
  description:
    "Demonstration prototype of an accessible digital health insurance claim journey. Not a real insurance service.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      data-text-size={DEFAULT_PREFERENCES.textSize}
      data-contrast={DEFAULT_PREFERENCES.contrast}
      className={`${sourceSans.variable} ${sourceSans.className} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <PreferencesProvider>
          <ClaimFormProvider>
            <AssistantProvider>
              <SkipLink />
              <SiteHeader />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <SiteFooter />
              <AssistantDock />
            </AssistantProvider>
          </ClaimFormProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
