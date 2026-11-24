import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground leading-relaxed">
        That page is not part of this demonstration prototype.
      </p>
      <Button asChild size="xl" className="w-fit">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
