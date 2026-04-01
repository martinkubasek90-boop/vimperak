import type { PublicEventItem } from "@/lib/public-content";

function formatUtcDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function downloadEventCalendarFile(event: PublicEventItem) {
  const start = new Date(`${event.date}T${event.time || "18:00"}:00`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const uid = `vimperk-${event.id}-${event.date}@vimperk.app`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vimperk App//CZ",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatUtcDate(new Date())}`,
    `DTSTART:${formatUtcDate(start)}`,
    `DTEND:${formatUtcDate(end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${(event.description || "").replace(/\n/g, "\\n")}`,
    `LOCATION:${event.place}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "akce"}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
