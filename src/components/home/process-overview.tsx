import { FORM_STAGES } from "@/lib/claim/stages";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProcessOverview() {
  return (
    <section aria-labelledby="process-heading" className="space-y-6">
      <div className="space-y-2">
        <h2 id="process-heading" className="text-2xl font-semibold tracking-tight">
          How the claim process works
        </h2>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
          Eight short sections. You can move forward and back without losing what
          you entered, and you never need the future assistant to finish.
        </p>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FORM_STAGES.map((stage) => (
          <li key={stage.id}>
            <Card className="h-full">
              <CardHeader>
                <p className="text-primary text-sm font-semibold">
                  Stage {stage.number}
                </p>
                <CardTitle className="text-lg">{stage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {stage.summary}
                </CardDescription>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}
