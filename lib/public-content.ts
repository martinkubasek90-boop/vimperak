import { getDirectory, getEvents, getNews, getPolls, getReportById, getReports } from "@/lib/db";
import type {
  DirectoryItem as MockDirectoryItem,
  Event as MockEvent,
  NewsItem as MockNewsItem,
  Report as MockReport,
} from "@/lib/data";

export type PublicNewsItem = MockNewsItem;
export type PublicEventItem = MockEvent;
export type PublicDirectoryItem = MockDirectoryItem;
export type PublicReport = MockReport;
export type PublicPoll = {
  id: string | number;
  question: string;
  options: Array<{
    id: string | number;
    text: string;
    votes: number;
  }>;
  totalVotes: number;
  endsAt: string;
  category: "infrastruktura" | "kultura" | "doprava" | "obecné";
};

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
    body: typeof item.body === "string" ? item.body : undefined,
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
        typeof candidate.id === "number" || typeof candidate.id === "string"
          ? candidate.id
          : index + 1,
      text: String(candidate.text ?? ""),
      votes: Number(candidate.votes ?? 0),
    };
  });

  return {
    id: typeof item.id === "number" || typeof item.id === "string" ? item.id : 0,
    question: String(item.question ?? ""),
    options,
    totalVotes: options.reduce((sum, option) => sum + option.votes, 0),
    endsAt: String(item.ends_at ?? item.endsAt ?? "").slice(0, 10),
    category: String(item.category ?? "obecné") as PublicPoll["category"],
  };
}

function normalizeDirectoryItem(item: Record<string, unknown>): PublicDirectoryItem {
  return {
    id:
      typeof item.id === "number"
        ? item.id
        : Number(String(item.id).slice(0, 8).replace(/\D/g, "")) || 0,
    name: String(item.name ?? ""),
    category: String(item.category ?? "obchod") as PublicDirectoryItem["category"],
    cityDepartment:
      typeof item.city_department === "string"
        ? (item.city_department as NonNullable<PublicDirectoryItem["cityDepartment"]>)
        : typeof item.cityDepartment === "string"
          ? (item.cityDepartment as NonNullable<PublicDirectoryItem["cityDepartment"]>)
          : undefined,
    phone: String(item.phone ?? ""),
    address: String(item.address ?? ""),
    hours: typeof item.hours === "string" ? item.hours : undefined,
    rating:
      typeof item.rating === "number"
        ? item.rating
        : typeof item.rating === "string"
          ? Number(item.rating)
          : undefined,
    note: typeof item.note === "string" ? item.note : undefined,
    email: typeof item.email === "string" ? item.email : undefined,
    website: typeof item.website === "string" ? item.website : undefined,
    sourceUrl:
      typeof item.source_url === "string"
        ? item.source_url
        : typeof item.sourceUrl === "string"
          ? item.sourceUrl
          : undefined,
    appointmentUrl:
      typeof item.appointment_url === "string"
        ? item.appointment_url
        : typeof item.appointmentUrl === "string"
          ? item.appointmentUrl
          : undefined,
    appointmentLabel:
      typeof item.appointment_label === "string"
        ? item.appointment_label
        : typeof item.appointmentLabel === "string"
          ? item.appointmentLabel
          : undefined,
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

export async function getPublicDirectory(): Promise<PublicDirectoryItem[]> {
  const items = await getDirectory();
  return items.map((item) => normalizeDirectoryItem(item as Record<string, unknown>));
}

function normalizeReport(item: Record<string, unknown>): PublicReport {
  return {
    id: String(item.id ?? ""),
    title: String(item.title ?? ""),
    description: String(item.description ?? ""),
    category: String(item.category ?? "jiné") as PublicReport["category"],
    status: String(item.status ?? "přijato") as PublicReport["status"],
    lat: typeof item.lat === "number" ? item.lat : typeof item.lat === "string" ? Number(item.lat) : undefined,
    lng: typeof item.lng === "number" ? item.lng : typeof item.lng === "string" ? Number(item.lng) : undefined,
    address: typeof item.address === "string" ? item.address : undefined,
    photo_url: typeof item.photo_url === "string" ? item.photo_url : undefined,
    reporter_email: typeof item.reporter_email === "string" ? item.reporter_email : undefined,
    created_at: String(item.created_at ?? new Date().toISOString()),
    updated_at: typeof item.updated_at === "string" ? item.updated_at : undefined,
  };
}

export async function getPublicReports(ids?: string[]): Promise<PublicReport[]> {
  const items = await getReports(ids);
  return items.map((item) => normalizeReport(item as Record<string, unknown>));
}

export async function getPublicReport(id: string): Promise<PublicReport | null> {
  const item = await getReportById(id);
  return item ? normalizeReport(item as Record<string, unknown>) : null;
}
