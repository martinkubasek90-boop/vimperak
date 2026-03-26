import { NextRequest, NextResponse } from "next/server";
import {
  lipnoEvents,
  lipnoExperiences,
  lipnoInfoCenter,
  lipnoRentals,
  lipnoServiceLinks,
} from "@/lib/lipno-data";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function answerLipno(query: string): string {
  const q = normalize(query);

  if (!q.trim()) {
    return "Pomohu s Lipnem: vstupenky, otevírací doby, webkamery, infocentrum, půjčovny i tipy na zážitky.";
  }

  if (/(prachatice|vimperk|brno|praha|ceske budejovice)/.test(q) && !q.includes("lipno")) {
    return "Pomohu hlavně s informacemi o Lipně. Zeptejte se prosím na vstupenky, provoz, zážitky, půjčovny nebo infocentrum.";
  }

  if (/(vstupenk|skipas|lipno.card|lipnocard|koupit)/.test(q)) {
    const tickets = lipnoServiceLinks.find((item) => item.title.includes("Vstupenky"));
    return [
      "Vstupenky a výhody pro areál koupíte přes oficiální Lipno.card.",
      `Odkaz: ${tickets?.href ?? "https://www.lipnocard.cz/"}`,
    ].join("\n");
  }

  if (/(webkamer|kamera|pocasi|snih)/.test(q)) {
    return [
      "Aktuální obraz z areálu i počasí najdete na oficiální stránce webkamer.",
      "Na stránce je výhled na jezero, Stezku korunami stromů i Království lesa.",
      "Odkaz: https://www.lipno.info/webkamery-na-lipne.html",
    ].join("\n");
  }

  if (/(oteviraci|provozni doba|lanovk|stezka|kralovstvi lesa|pokladn)/.test(q)) {
    return [
      "Otevírací a provozní doby jsou na jedné oficiální stránce Lipna.",
      "Najdete tam Stezku korunami stromů, Království lesa, lanové dráhy i infocentrum.",
      "Odkaz: https://www.lipno.info/oteviraci-a-provozni-doby.html",
    ].join("\n");
  }

  if (/(infocentr|kontakt|parkov|smenarna)/.test(q)) {
    return [
      `${lipnoInfoCenter.title}: ${lipnoInfoCenter.address}`,
      `Telefon: ${lipnoInfoCenter.phone}`,
      `E-mail: ${lipnoInfoCenter.email}`,
      lipnoInfoCenter.parking,
      "Odkaz: https://www.lipno.info/infocentrum.html",
    ].join("\n");
  }

  if (/(pujcovn|kajak|sup|paddle|slapadl|kolo|vybaven)/.test(q)) {
    const rental = lipnoRentals[0];
    return [
      `Doporučená půjčovna: ${rental.title} (${rental.area}).`,
      rental.summary,
      `Kontakt: ${rental.contact}`,
      `Odkaz: ${rental.href}`,
    ].join("\n");
  }

  if (/(deti|rodin|co delat|zazitk|atrakc)/.test(q)) {
    const picks = lipnoExperiences.slice(0, 3);
    return [
      "Na Lipně bych doporučil tyto top zážitky:",
      ...picks.map((item) => `- ${item.title}: ${item.summary}`),
    ].join("\n");
  }

  if (/(kalendar|akce|program|festival)/.test(q)) {
    return [
      "V kalendáři Lipna teď běží hlavně tyto akce:",
      ...lipnoEvents.slice(0, 3).map((item) => `- ${item.title} (${item.dateLabel})`),
      "Odkaz: https://www.lipno.info/kalendar.html",
    ].join("\n");
  }

  return "Pomohu s Lipnem: vstupenky, provoz, webkamery, zážitky, kalendář, půjčovny a infocentrum. Zkuste dotaz trochu upřesnit.";
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    const question = [...messages].reverse().find((item) => item.role === "user")?.content ?? "";

    return NextResponse.json({
      reply: answerLipno(question),
      mode: "fallback",
    });
  } catch {
    return NextResponse.json({
      reply: answerLipno(""),
      mode: "fallback",
    });
  }
}
