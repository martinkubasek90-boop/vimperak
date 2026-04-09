import { notFound } from "next/navigation";
import { EventDetailClient } from "@/components/public/EventDetailClient";
import { getPublicEvents } from "@/lib/public-content";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const events = await getPublicEvents();
  const item = events.find((candidate) => String(candidate.id) === id);

  if (!item) notFound();

  const related = events
    .filter((candidate) => candidate.id !== item.id && candidate.category === item.category)
    .slice(0, 3);

  return <EventDetailClient item={item} related={related} />;
}
