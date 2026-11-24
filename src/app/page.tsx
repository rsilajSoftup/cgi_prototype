import { ArrowRight, CircleCheck, FileText, Lock } from "lucide-react";
import Link from "next/link";

import { ProcessOverview } from "@/components/home/process-overview";
import { DemoNotice } from "@/components/layout/demo-notice";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-16 px-4 py-10 sm:px-6 sm:py-16">
      <DemoNotice />
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:items-center">
        <div className="space-y-6">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Health insurance claims
          </p>
          <h1 className="text-foreground max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Submit a health insurance claim with clear steps and plain language
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            This prototype shows how a digital claim journey can help you
            understand what is needed, provide accurate information, and feel
            confident before you send a claim.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href="/claim/insurance">
                Start a claim
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link href="/track">View a demonstration claim</Link>
            </Button>
          </div>
        </div>
        <aside
          aria-labelledby="reassurance-heading"
          className="border-border bg-card space-y-4 rounded-2xl border p-6"
        >
          <h2 id="reassurance-heading" className="text-lg font-semibold">
            Designed to be easy to follow
          </h2>
          <ul className="space-y-4 text-sm leading-relaxed">
            <li className="flex gap-3">
              <CircleCheck className="text-primary mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <span>One stage at a time, with a visible progress indicator.</span>
            </li>
            <li className="flex gap-3">
              <FileText className="text-primary mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <span>
                Space for an assistant later. You can complete the claim without
                it.
              </span>
            </li>
            <li className="flex gap-3">
              <Lock className="text-primary mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <span>
                Fictional example data only. No real customer or medical
                information is used.
              </span>
            </li>
          </ul>
        </aside>
      </section>
      <ProcessOverview />
    </div>
  );
}
