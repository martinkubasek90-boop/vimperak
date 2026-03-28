import { getEvents, getNews, getPolls } from "@/lib/db";
import type { Event as MockEvent, NewsItem as MockNewsItem, Poll as MockPoll } from "@/lib/data";

export type PublicNewsItem = MockNewsItem;
export type PublicEventItem = MockEvent;
export type PublicPoll = MockPoll;

const newsImageByCategory: Record<PublicNewsItem["category"], string> = {
  upozornění: "/news/upozorneni.svg",
  radnice: "/news/radnice.svg",
  sport: "/news/sport.svg",
  kultura: "/news/kultura.svg",
  komunita: "/news/radnice.svg",
};

function normalizeNewsItem(item: Record<string, unknown>): PublicNewsItem {
  const category = String(item.category) as PublicNewsItem["category"];
  const dateSource =
    typeof item.published_at === "string"
      ? item.published_at
      : typeof item.date === "string"
        ? item.date
        : new Date().toISOString();

  return {
    id: typeof item.id === "number" ? item.id : Number(String(item.id).slice(0, 8).replace(/\D/g, "")) || 0,
    title: String(item.title ?? ""),
    summary: String(item.summary ?? ""),
    date: dateSource.slice(0, 10),
    category,
    urgent: Boolean(item.urgent),
    image: newsImageByCategory[category] ?? "/news/radnice.svg",
  };
}

function normalizeEventItem(item: Record<string, unknown>): PublicEventItem {
  const price =
    typeof item.price === "string" ? item.price : undefined;

  return {
    id: typeof item.id === "number" ? item.id : Number(String(item.id).slice(0, 8).replace(/\D/g, "")) || 0,
    title: String(item.title ?? ""),
    date: String(item.date ?? ""),
    time: String(item.time ?? "").slice(0, 5),
    place: String(item.place ?? ""),
    category: String(item.category ?? "kultura") as PublicEventItem["category"],
    description: String(item.description ?? ""),
    free: Boolean(item.free),
    price,
  };
}

function normalizePoll(item: Record<string, unknown>): PublicPoll {
  const optionsSource = Array.isArray(item.poll_options)
    ? item.poll_options
    : Array.isArray(item.options)
      ? item.options
      : [];

  const options = optionsSource.map((option, index) => {
    const candidate = option as Record<string, unknown>;
    return {
      id:
        typeof candidate.id === "number"
          ? candidate.id
          : Number(String(candidate.id).slice(0, 8).replace(/\D/g, "")) || index + 1,
      text: String(candidate.text ?? ""),
      votes: Number(candidate.votes ?? 0),
    };
  });

  return {
    id: typeof item.id === "number" ? item.id : Number(String(item.id).slice(0, 8).replace(/\D/g, "")) || 0,
    question: String(item.question ?? ""),
    options,
    totalVotes: options.reduce((sum, option) => sum + option.votes, 0),
    endsAt: String(item.ends_at ?? item.endsAt ?? "").slice(0, 10),
    category: String(item.category ?? "obecné") as PublicPoll["category"],
  };
}

export async function getPublicNews(): Promise<PublicNewsItem[]> {
  const items = await getNews();
  return items.map((item) => normalizeNewsItem(item as Record<string, unknown>));
}

export async function getPublicEvents(): Promise<PublicEventItem[]> {
  const items = await getEvents();
  return items.map((item) => normalizeEventItem(item as Record<string, unknown>));
}

export async function getPublicPolls(): Promise<PublicPoll[]> {
  const items = await getPolls();
  return items.map((item) => normalizePoll(item as Record<string, unknown>));
}
