import { SearchPageClient } from "@/components/search/SearchPageClient";
import {
  getPublicDirectory,
  getPublicEvents,
  getPublicNews,
  getPublicPolls,
} from "@/lib/public-content";

export default async function SearchPage() {
  const [news, events, directory, polls] = await Promise.all([
    getPublicNews(),
    getPublicEvents(),
    getPublicDirectory(),
    getPublicPolls(),
  ]);

  return (
    <SearchPageClient
      news={news}
      events={events}
      directory={directory}
      polls={polls}
    />
  );
}
