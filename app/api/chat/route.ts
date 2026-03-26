import { NextRequest, NextResponse } from "next/server";
import { answerFromKnowledgeBase, getKBSystemContext, getKBStatus } from "@/lib/knowledge";
import { busLines, directory, events } from "@/lib/data";

const BASE_SYSTEM = `Jsi Vimperák — přátelský a chytrý AI asistent komunitního portálu města Vimperk v jihočeském kraji.

## Tvoje role
Pomáháš obyvatelům i návštěvníkům Vimperka najít potřebné informace o životě ve městě.
Odpovídáš vždy v češtině, přátelsky, stručně a věcně.

## Záchranné kontakty (vždy uveď při nouzi)
- **112** — Integrovaný záchranný systém (vše)
- **155** — Záchranná služba
- **150** — Hasiči
- **158** — Policie ČR
- **388 402 110** — Městská policie Vimperk

## Radnice Vimperk
- Adresa: Náměstí Svobody 8, 385 01 Vimperk
- Telefon: 388 402 111
- E-mail: podatelna@vimperk.cz
- Web: vimperk.cz

## Pravidla
- Pokud máš v kontextu relevantní informace z webu vimperk.cz, použij je jako primární zdroj
- Cituj URL zdroje pokud je to užitečné
- Pokud informaci nevíš, nasměruj uživatele na radnici nebo vimperk.cz
- Při dotazech na záchranku nebo hasiče vždy uveď číslo 112
- Neodpovídej na témata nesouvisející s Vimperkem a Šumavou`;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildLocalFallbackReply(query: string): string {
  const q = normalize(query);

  if (q.includes("prachat") || q.includes("autobus") || q.includes("jizdni rad")) {
    const line = busLines.find((item) => normalize(item.to).includes("prachat")) ?? busLines[0];
    return [
      `Nejbližší lokální odpověď k autobusům: linka ${line.number} ${line.from} -> ${line.to}.`,
      `Odjezdy: ${line.departures.slice(0, 6).join(", ")}${line.departures.length > 6 ? "..." : ""}.`,
      line.note ? `Poznámka: ${line.note}.` : null,
      "Pro přesný aktuální spoj doporučuji ověřit oficiální jízdní řád.",
    ].filter(Boolean).join("\n");
  }

  if (q.includes("lekar") || q.includes("lekar") || q.includes("lekarn")) {
    const results = directory.filter((item) => ["lékař", "lékárna"].includes(item.category)).slice(0, 3);
    return [
      "Našel jsem tyto kontakty ve Vimperku:",
      ...results.map((item) => `- ${item.name}, ${item.address}, tel. ${item.phone}${item.hours ? `, ordinační doba: ${item.hours}` : ""}`),
    ].join("\n");
  }

  if (q.includes("taxi")) {
    const taxis = directory.filter((item) => item.category === "taxi").slice(0, 2);
    return [
      "Taxi ve Vimperku:",
      ...taxis.map((item) => `- ${item.name}, tel. ${item.phone}${item.hours ? `, provoz: ${item.hours}` : ""}`),
    ].join("\n");
  }

  if (q.includes("vikend") || q.includes("akce") || q.includes("deje")) {
    const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
    return [
      "Nejbližší akce ve Vimperku:",
      ...upcoming.map((event) => `- ${event.title} (${event.date} v ${event.time}, ${event.place})`),
    ].join("\n");
  }

  if (q.includes("zavad") || q.includes("nahlasit")) {
    return [
      "Závadu můžete nahlásit v sekci Hlášení závad.",
      "Připravte stručný popis, místo a ideálně fotku.",
      "V akutním případě kontaktujte městskou policii na 388 402 110 nebo linku 112.",
    ].join("\n");
  }

  const kbAnswer = answerFromKnowledgeBase(query);
  if (kbAnswer) return kbAnswer.reply;

  return "Teď běžím v omezeném režimu. Zkuste dotaz upřesnit, nebo kontaktujte radnici na 388 402 231 a urad@mesto.vimperk.cz.";
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    // Vezmi poslední uživatelský dotaz pro retrieval a fallback
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({
        reply: buildLocalFallbackReply(lastUserMessage),
        kb: null,
        mode: "fallback",
      }, { status: 503 });
    }

    // Získej relevantní chunks z KB
    const kbContext  = getKBSystemContext(lastUserMessage);
    const kbStatus   = getKBStatus();

    // Sestav system prompt s KB kontextem
    const systemPrompt = kbContext
      ? BASE_SYSTEM + kbContext
      : BASE_SYSTEM;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.3,
        max_completion_tokens: 600,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-12),
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[chat] Groq API error:", response.status, errorBody);
      return NextResponse.json({
        reply: buildLocalFallbackReply(lastUserMessage),
        kb: kbStatus.available
          ? { chunks_used: kbContext ? kbContext.split("---").length : 0, scraped_at: kbStatus.scraped_at }
          : null,
        mode: "fallback",
      }, { status: 502 });
    }

    const data = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const reply = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!reply) {
      return NextResponse.json({
        reply: buildLocalFallbackReply(lastUserMessage),
        kb: kbStatus.available
          ? { chunks_used: kbContext ? kbContext.split("---").length : 0, scraped_at: kbStatus.scraped_at }
          : null,
        mode: "fallback",
      }, { status: 200 });
    }

    return NextResponse.json({
      reply,
      kb: kbStatus.available
        ? { chunks_used: kbContext ? kbContext.split("---").length : 0, scraped_at: kbStatus.scraped_at }
        : null,
      mode: "ai",
    });
  } catch (err) {
    console.error("[chat]", err);
    return NextResponse.json({
      reply: buildLocalFallbackReply(""),
      kb: null,
      mode: "fallback",
    });
  }
}
