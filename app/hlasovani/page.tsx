import { HlasovaniPageClient } from "@/components/public/HlasovaniPageClient";
import { getPublicPolls } from "@/lib/public-content";

export default async function HlasovaniPage() {
  const polls = await getPublicPolls();
  return <HlasovaniPageClient polls={polls} />;
}
