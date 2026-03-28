import { KalendarPageClient } from "@/components/public/KalendarPageClient";
import { getPublicEvents } from "@/lib/public-content";

export default async function KalendarPage() {
  const events = await getPublicEvents();
  return <KalendarPageClient events={events} />;
}
