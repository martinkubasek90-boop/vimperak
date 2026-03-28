import { AkcePageClient } from "@/components/public/AkcePageClient";
import { getPublicEvents } from "@/lib/public-content";

export default async function AkcePage() {
  const events = await getPublicEvents();
  return <AkcePageClient events={events} />;
}
