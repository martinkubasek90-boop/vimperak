import { HomePageClient } from "@/components/home/HomePageClient";
import {
  getPublicEvents,
  getPublicNews,
  getPublicPolls,
} from "@/lib/public-content";

export default async function HomePage() {
  const [events, news, polls] = await Promise.all([
    getPublicEvents(),
    getPublicNews(),
    getPublicPolls(),
  ]);

  return (
    <HomePageClient
      events={events}
      news={news}
      polls={polls}
    />
  );
}
