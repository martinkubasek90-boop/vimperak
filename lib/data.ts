// ─── EVENTS ──────────────────────────────────────────────────────────────────
export type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  place: string;
  category: "kultura" | "sport" | "kino" | "úřad" | "trhy";
  description: string;
  free: boolean;
  price?: string;
};

export const events: Event[] = [
  {
    id: 1,
    title: "Vimperský jarmark",
    date: "2026-04-05",
    time: "09:00",
    place: "Náměstí Svobody",
    category: "trhy",
    description: "Tradiční jarní jarmark s místními řemeslníky, jídlem a zábavou pro děti.",
    free: true,
  },
  {
    id: 2,
    title: "Kino: Anatole — CZ dabing",
    date: "2026-03-28",
    time: "17:30",
    place: "Kino Vimperk",
    category: "kino",
    description: "Animovaná rodinná komedie pro děti i rodiče.",
    free: false,
    price: "130 Kč",
  },
  {
    id: 3,
    title: "Kino: Rival — CZ titulky",
    date: "2026-03-28",
    time: "20:00",
    place: "Kino Vimperk",
    category: "kino",
    description: "Sportovní drama nominované na Oscara.",
    free: false,
    price: "160 Kč",
  },
  {
    id: 4,
    title: "Hokejový turnaj mládeže",
    date: "2026-03-29",
    time: "10:00",
    place: "Zimní stadion Vimperk",
    category: "sport",
    description: "Turnaj kategorie U12 a U14. Vstup zdarma pro diváky.",
    free: true,
  },
  {
    id: 5,
    title: "Přednáška: Šumavská příroda",
    date: "2026-04-02",
    time: "18:00",
    place: "Kulturní dům Vimperk",
    category: "kultura",
    description: "Přednáška fotografa Petra Nováka o životě zvířat v NP Šumava.",
    free: false,
    price: "80 Kč",
  },
  {
    id: 6,
    title: "Veřejné zastupitelstvo",
    date: "2026-04-07",
    time: "17:00",
    place: "Radnice Vimperk",
    category: "úřad",
    description: "Zasedání zastupitelstva města. Veřejnost vítána.",
    free: true,
  },
];

// ─── BUS SCHEDULES ────────────────────────────────────────────────────────────
export type BusLine = {
  id: number;
  number: string;
  from: string;
  to: string;
  departures: string[];
  note?: string;
};

export const busLines: BusLine[] = [
  {
    id: 1,
    number: "190",
    from: "Vimperk",
    to: "České Budějovice",
    departures: ["05:15", "06:30", "07:45", "09:00", "11:30", "13:00", "15:15", "17:30", "19:00"],
    note: "Přes Prachatice",
  },
  {
    id: 2,
    number: "191",
    from: "Vimperk",
    to: "Prachatice",
    departures: ["06:00", "08:00", "10:30", "12:00", "14:30", "16:00", "17:45", "19:30"],
  },
  {
    id: 3,
    number: "195",
    from: "Vimperk",
    to: "Kašperské Hory",
    departures: ["07:20", "09:45", "12:15", "14:00", "16:20", "18:00"],
    note: "Šumava Express",
  },
  {
    id: 4,
    number: "197",
    from: "Vimperk",
    to: "Volary",
    departures: ["06:45", "09:15", "11:00", "13:30", "15:00", "17:00", "19:15"],
  },
];

// ─── DIRECTORY ────────────────────────────────────────────────────────────────
export type DirectoryItem = {
  id: number;
  name: string;
  category: "taxi" | "restaurace" | "lékař" | "lékárna" | "opravna" | "sport" | "ubytování" | "obchod";
  phone: string;
  address: string;
  hours?: string;
  rating?: number;
  note?: string;
};

export const directory: DirectoryItem[] = [
  // Taxi
  {
    id: 1,
    name: "Taxi Vimperk — Pavel Kotal",
    category: "taxi",
    phone: "602 111 222",
    address: "Vimperk",
    hours: "0–24 hod",
    rating: 4.8,
    note: "Disponibilní 24/7, odvoz na letiště Praha",
  },
  {
    id: 2,
    name: "Taxi Šumava",
    category: "taxi",
    phone: "777 333 444",
    address: "Vimperk",
    hours: "6:00–22:00",
    rating: 4.5,
  },
  // Restaurace
  {
    id: 3,
    name: "Restaurace Na Hradbách",
    category: "restaurace",
    phone: "388 412 001",
    address: "Náměstí Svobody 12, Vimperk",
    hours: "11:00–22:00",
    rating: 4.3,
    note: "Česká kuchyně, denní menu",
  },
  {
    id: 4,
    name: "Pivnice U Jelena",
    category: "restaurace",
    phone: "388 412 120",
    address: "Steinbrenerova 8, Vimperk",
    hours: "11:00–23:00",
    rating: 4.1,
    note: "Domácí pivo, grilované speciality",
  },
  {
    id: 5,
    name: "Šumavská kavárna",
    category: "restaurace",
    phone: "775 222 333",
    address: "Náměstí Svobody 3, Vimperk",
    hours: "8:00–18:00",
    rating: 4.6,
    note: "Snídaně, dezerty, káva",
  },
  // Lékaři
  {
    id: 6,
    name: "MUDr. Jana Procházková — Praktický lékař",
    category: "lékař",
    phone: "388 412 300",
    address: "Nemocniční 430, Vimperk",
    hours: "Po-Pá 7:30–12:00, Po+St 13:00–16:30",
    rating: 4.7,
  },
  {
    id: 7,
    name: "MUDr. Tomáš Kovář — Dětský lékař",
    category: "lékař",
    phone: "388 412 310",
    address: "Nemocniční 430, Vimperk",
    hours: "Po-Pá 7:30–12:00",
    rating: 4.9,
  },
  {
    id: 8,
    name: "MUDr. Eva Horáková — Zubař",
    category: "lékař",
    phone: "388 412 350",
    address: "Náměstí Svobody 18, Vimperk",
    hours: "Po-Čt 8:00–12:00, 13:00–16:00",
    rating: 4.4,
  },
  // Lékárny
  {
    id: 9,
    name: "Lékárna Dobrá zdraví",
    category: "lékárna",
    phone: "388 412 400",
    address: "Náměstí Svobody 2, Vimperk",
    hours: "Po-Pá 8:00–17:30, So 9:00–12:00",
    rating: 4.5,
  },
  // Sport
  {
    id: 10,
    name: "Aquapark Vimperk",
    category: "sport",
    phone: "388 412 500",
    address: "Špidrova 1, Vimperk",
    hours: "Po-Ne 9:00–21:00",
    rating: 4.2,
    note: "Krytý bazén, sauna, fitness",
  },
];

// ─── NEWS ─────────────────────────────────────────────────────────────────────
export type NewsItem = {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: "radnice" | "sport" | "kultura" | "upozornění" | "komunita";
  urgent?: boolean;
};

export const news: NewsItem[] = [
  {
    id: 1,
    title: "Uzavírka ulice Pivovarská — od 28. března",
    summary: "Z důvodu opravy vodovodu bude ulice Pivovarská uzavřena pro dopravu od 28. 3. do 15. 4. 2026. Objízdná trasa přes ulici Steinbrenerovu.",
    date: "2026-03-25",
    category: "upozornění",
    urgent: true,
  },
  {
    id: 2,
    title: "Nová hřiště v parku Blanice — hlasování spuštěno",
    summary: "Radnice spustila hlasování o podobě nových dětských hřišť v parku Blanice. Vyberte ze tří variant — hlasování trvá do 10. dubna.",
    date: "2026-03-24",
    category: "radnice",
  },
  {
    id: 3,
    title: "HC Vimperk slaví postup do krajské ligy!",
    summary: "Hokejisté Vimperka porazili v neděli Klatovy 4:2 a zajistili si postup do vyšší soutěže. Gratulujeme!",
    date: "2026-03-23",
    category: "sport",
  },
  {
    id: 4,
    title: "Jarní svoz nebezpečného odpadu — 5. dubna",
    summary: "Město Vimperk organizuje svoz nebezpečného odpadu. Přistavení kontejnerů proběhne 5. dubna na náměstí Svobody od 9:00 do 13:00.",
    date: "2026-03-22",
    category: "radnice",
  },
  {
    id: 5,
    title: "Turistická sezóna na Šumavě se blíží",
    summary: "NP Šumava hlásí, že od 1. dubna budou otevřeny všechny pěší trasy v okolí Vimperka. Připravte si boty!",
    date: "2026-03-20",
    category: "kultura",
  },
];

// ─── POLLS ────────────────────────────────────────────────────────────────────
export type PollOption = {
  id: number;
  text: string;
  votes: number;
};

export type Poll = {
  id: number;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: string;
  category: "infrastruktura" | "kultura" | "doprava" | "obecné";
};

export const polls: Poll[] = [
  {
    id: 1,
    question: "Jakou podobu hřiště v parku Blanice preferujete?",
    options: [
      { id: 1, text: "Moderní prolézačky a lezecká stěna", votes: 187 },
      { id: 2, text: "Tradiční houpačky a pískoviště", votes: 94 },
      { id: 3, text: "Multifunkční sportoviště (basketbal + pingpong)", votes: 211 },
    ],
    totalVotes: 492,
    endsAt: "2026-04-10",
    category: "infrastruktura",
  },
  {
    id: 2,
    question: "Jak jste spokojeni s frekvencí autobusů do Prachatic?",
    options: [
      { id: 4, text: "Velmi spokojen/a", votes: 43 },
      { id: 5, text: "Spíše spokojen/a", votes: 89 },
      { id: 6, text: "Spíše nespokojen/a", votes: 156 },
      { id: 7, text: "Velmi nespokojen/a", votes: 201 },
    ],
    totalVotes: 489,
    endsAt: "2026-04-15",
    category: "doprava",
  },
];

// ─── EMERGENCY CONTACTS ───────────────────────────────────────────────────────
export const emergencyContacts = [
  { name: "Tísňová linka", number: "112", icon: "phone" },
  { name: "Záchranná služba", number: "155", icon: "heart" },
  { name: "Hasiči", number: "150", icon: "flame" },
  { name: "Policie ČR", number: "158", icon: "shield" },
  { name: "Městská policie Vimperk", number: "388 402 110", icon: "shield" },
  { name: "Pohotovost Vimperk", number: "388 402 200", icon: "heart" },
];
