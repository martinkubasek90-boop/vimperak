function toValidDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getDateBadgeParts(value: string, locale = "cs-CZ") {
  const date = toValidDate(value);
  if (!date) {
    return {
      day: "—",
      month: "bez data",
    };
  }

  return {
    day: String(date.getDate()),
    month: date.toLocaleDateString(locale, { month: "short" }),
  };
}

export function formatRelativeDateLabel(value: string) {
  const date = toValidDate(value);
  if (!date) return "Bez data";

  const diff = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diff === 0) return "Dnes";
  if (diff === 1) return "Včera";
  if (diff > 1 && diff < 7) return `Před ${diff} dny`;
  if (diff >= 7) return `Před ${Math.floor(diff / 7)} týd.`;

  return date.toLocaleDateString("cs-CZ");
}
