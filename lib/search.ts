import { buildDirectorySearchIndex } from "@/lib/directory";
import type {
  PublicDirectoryItem,
  PublicEventItem,
  PublicNewsItem,
  PublicPoll,
} from "@/lib/public-content";

export type SearchResultItem = {
  id: string;
  type: "news" | "event" | "directory" | "poll";
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
};

export function buildSearchIndex(input: {
  news: PublicNewsItem[];
  events: PublicEventItem[];
  directory: PublicDirectoryItem[];
  polls: PublicPoll[];
}) {
  return [
    ...input.news.map<SearchResultItem>((item) => ({
      id: `news-${item.id}`,
      type: "news",
      title: item.title,
      subtitle: `${item.category} · ${item.date}`,
      href: "/zpravodaj",
      keywords: [item.title, item.summary, item.category, item.date].join(" ").toLowerCase(),
    })),
    ...input.events.map<SearchResultItem>((item) => ({
      id: `event-${item.id}`,
      type: "event",
      title: item.title,
      subtitle: `${item.place} · ${item.date} ${item.time}`,
      href: "/kalendar",
      keywords: [item.title, item.description, item.place, item.category, item.date, item.time]
        .join(" ")
        .toLowerCase(),
    })),
    ...input.directory.map<SearchResultItem>((item) => ({
      id: `directory-${item.id}`,
      type: "directory",
      title: item.name,
      subtitle: `${item.category} · ${item.address}`,
      href: item.category === "město" ? "/kontakty" : `/adresar?k=${encodeURIComponent(item.category)}`,
      keywords: buildDirectorySearchIndex(item),
    })),
    ...input.polls.map<SearchResultItem>((item) => ({
      id: `poll-${item.id}`,
      type: "poll",
      title: item.question,
      subtitle: `${item.category} · do ${item.endsAt}`,
      href: "/hlasovani",
      keywords: [item.question, item.category, item.endsAt, ...item.options.map((option) => option.text)]
        .join(" ")
        .toLowerCase(),
    })),
  ];
}
