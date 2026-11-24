import { TrackDetails } from "@/components/claim/track-details";
import { JourneyShell } from "@/components/claim/journey-shell";

export const metadata = {
  title: "Track a claim",
};

export default function TrackPage() {
  return (
    <JourneyShell
      currentStageId="track"
      heading="Track your demonstration claim"
      summary="Status updates are simulated. If you have just confirmed a demonstration claim, its reference appears below. Otherwise this page shows fictional sample data."
      showNavigation
    >
      <TrackDetails />
    </JourneyShell>
  );
}
