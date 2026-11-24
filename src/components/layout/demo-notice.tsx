import { Info } from "lucide-react";

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  return (
    <p
      role="note"
      className="border-border bg-secondary text-secondary-foreground flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed"
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        {compact
          ? "Demonstration prototype. No real claims, payments or medical decisions."
          : "This is a university demonstration prototype. It does not connect to an insurance company, process real claims, or use real customer or medical information."}
      </span>
    </p>
  );
}
