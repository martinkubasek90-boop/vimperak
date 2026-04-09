import { notFound } from "next/navigation";
import { PollDetailClient } from "@/components/public/PollDetailClient";
import { getPublicPolls } from "@/lib/public-content";

export default async function PollDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const polls = await getPublicPolls();
  const poll = polls.find((candidate) => String(candidate.id) === id);

  if (!poll) notFound();

  const related = polls.filter((candidate) => candidate.id !== poll.id).slice(0, 3);

  return <PollDetailClient poll={poll} related={related} />;
}
