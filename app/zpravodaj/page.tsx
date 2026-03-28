import { ZpravodajPageClient } from "@/components/public/ZpravodajPageClient";
import { getPublicEvents, getPublicNews } from "@/lib/public-content";

export default async function ZpravodajPage() {
  const [news, events] = await Promise.all([getPublicNews(), getPublicEvents()]);
  return <ZpravodajPageClient news={news} events={events} />;
}
