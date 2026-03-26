export type LipnoExperience = {
  id: number;
  title: string;
  category: "rodiny" | "sport" | "voda" | "adrenalin" | "wellness";
  summary: string;
  season: string;
  duration: string;
  highlight: string;
  href: string;
};

export type LipnoEvent = {
  id: number;
  title: string;
  dateLabel: string;
  category: "rodiny" | "sport" | "festival" | "vecer";
  summary: string;
  href: string;
};

export type LipnoServiceLink = {
  id: number;
  title: string;
  text: string;
  icon: string;
  href: string;
  badge?: string;
};

export type LipnoQuickAction = {
  id: number;
  title: string;
  icon: string;
  href: string;
};

export type LipnoRental = {
  id: number;
  title: string;
  area: string;
  contact: string;
  summary: string;
  href: string;
};

export const lipnoBrand = {
  primary: "#0c4a6e",
  primarySoft: "#e0f2fe",
  secondary: "#0f766e",
  secondarySoft: "#d1fae5",
  accent: "#f97316",
  accentSoft: "#ffedd5",
  sand: "#faf7f2",
  surface: "#ffffff",
  ink: "#12212f",
  muted: "#597081",
};

export const lipnoQuickActions: LipnoQuickAction[] = [
  { id: 1, title: "Vstupenky", icon: "confirmation_number", href: "https://www.lipnocard.cz/" },
  { id: 2, title: "Webkamery", icon: "videocam", href: "https://www.lipno.info/webkamery-na-lipne.html" },
  { id: 3, title: "Otevírací doby", icon: "schedule", href: "https://www.lipno.info/oteviraci-a-provozni-doby.html" },
  { id: 4, title: "Infocentrum", icon: "info", href: "https://www.lipno.info/infocentrum.html" },
  { id: 5, title: "Půjčovny", icon: "downhill_skiing", href: "/lipno/servis" },
  { id: 6, title: "Kalendář", icon: "event", href: "/lipno/kalendar" },
];

export const lipnoServiceLinks: LipnoServiceLink[] = [
  {
    id: 1,
    title: "Vstupenky a Lipno.card",
    text: "Rychlý vstup do online prodeje skipasů, atrakcí a výhod.",
    icon: "confirmation_number",
    href: "https://www.lipnocard.cz/",
    badge: "Oficiální prodej",
  },
  {
    id: 2,
    title: "Webkamery na Lipně",
    text: "Jezero, Stezka korunami stromů, Království lesa i restaurace U Yettiho.",
    icon: "videocam",
    href: "https://www.lipno.info/webkamery-na-lipne.html",
  },
  {
    id: 3,
    title: "Otevírací a provozní doby",
    text: "Stezka, Království lesa, lanové dráhy a infocentrum na jednom místě.",
    icon: "schedule",
    href: "https://www.lipno.info/oteviraci-a-provozni-doby.html",
  },
  {
    id: 4,
    title: "Infocentrum Lipno",
    text: "Kontakt, mapa, parkování P1, směnárna a pomoc s plánováním pobytu.",
    icon: "travel_explore",
    href: "https://www.lipno.info/infocentrum.html",
  },
  {
    id: 5,
    title: "Kalendář akcí",
    text: "Denní program, festivaly, animace i rodinné akce v areálu.",
    icon: "event_available",
    href: "https://www.lipno.info/kalendar.html",
  },
  {
    id: 6,
    title: "Kontakty",
    text: "Klientské informační centrum a tým Lipno Servis.",
    icon: "call",
    href: "https://www.lipno.info/kontakty.html",
  },
];

export const lipnoExperiences: LipnoExperience[] = [
  {
    id: 1,
    title: "Stezka korunami stromů",
    category: "rodiny",
    summary: "Celoroční ikonický zážitek s výhledy nad jezerem a večerní světelnou trasou.",
    season: "Celoročně",
    duration: "2–3 hod",
    highlight: "Přístup bez bariér",
    href: "https://www.lipno.info/zazitky/stezka-korunami-stromu-lipno.html",
  },
  {
    id: 2,
    title: "Skiareál Lipno",
    category: "sport",
    summary: "Rodinné sjezdovky, moderní lanovky a večerní lyžování.",
    season: "Zima",
    duration: "Půlden až celý den",
    highlight: "Denní lyžování 8:30–16:00",
    href: "https://www.lipno.info/zazitky/skiareal-lipno.html",
  },
  {
    id: 3,
    title: "Království lesa",
    category: "rodiny",
    summary: "Velký lesní park pro děti s celodenním programem a volným pohybem.",
    season: "Jaro až podzim",
    duration: "3+ hod",
    highlight: "Rodinná top atrakce",
    href: "https://www.lipno.info/oteviraci-a-provozni-doby.html",
  },
  {
    id: 4,
    title: "Aquaworld Lipno",
    category: "wellness",
    summary: "Vodní relax a vnitřní zázemí jako jistota i při horším počasí.",
    season: "Celoročně",
    duration: "1–2 hod",
    highlight: "Za každého počasí",
    href: "https://www.lipno.info/lipno.html",
  },
  {
    id: 5,
    title: "Lanový park",
    category: "adrenalin",
    summary: "Lehce adrenalinový program nad centrálním parkovištěm s kladkou nad vodou.",
    season: "Jaro až podzim",
    duration: "1 hod+",
    highlight: "Vhodné pro skupiny",
    href: "https://www.lipno.info/zazitky/lanovy-park.html",
  },
  {
    id: 6,
    title: "Vodní plavidla",
    category: "voda",
    summary: "Paddleboardy, šlapadla, veslice a kajaky přímo u jezera.",
    season: "Léto",
    duration: "1–3 hod",
    highlight: "Beach aréna a Modřín",
    href: "https://www.lipno.info/pujcovny/vodni-plavidla.html",
  },
];

export const lipnoEvents: LipnoEvent[] = [
  {
    id: 1,
    title: "Magická Stezka korunami stromů",
    dateLabel: "až do 28. 2.",
    category: "rodiny",
    summary: "Večerní světelná trasa plná barev, zvířat a atmosféry nad lesem.",
    href: "https://www.lipno.info/kalendar.html",
  },
  {
    id: 2,
    title: "Zimní animace s lišákem Foxem",
    dateLabel: "30. 1. 2026",
    category: "rodiny",
    summary: "Program pro děti i rodiče přímo v rodinném areálu Lipno.",
    href: "https://www.lipno.info/kalendar.html",
  },
  {
    id: 3,
    title: "Kramolínský obřák",
    dateLabel: "14. 2. 2026",
    category: "sport",
    summary: "Otevřený závod pro malé i větší lyžaře v rodinném skiareálu.",
    href: "https://www.lipno.info/kalendar.html",
  },
  {
    id: 4,
    title: "KolemKolem Fest 2026",
    dateLabel: "léto 2026",
    category: "festival",
    summary: "Hudba, jezero, letní program a víkendový ruch v areálu.",
    href: "https://www.lipno.info/kalendar.html",
  },
];

export const lipnoRentals: LipnoRental[] = [
  {
    id: 1,
    title: "Vodní plavidla",
    area: "Beach aréna a pláž pod bazénem",
    contact: "+420 731 410 813",
    summary: "Šlapadla, kajaky, veslice a paddleboardy s poslední výpůjčkou 60 minut před koncem provozu.",
    href: "https://www.lipno.info/pujcovny/vodni-plavidla.html",
  },
  {
    id: 2,
    title: "Bikepark a sport shop",
    area: "Centrální areál",
    contact: "dle provozní doby",
    summary: "Servisní zázemí, vybavení a sezónní půjčení pro aktivní den v areálu.",
    href: "https://www.lipno.info/oteviraci-a-provozni-doby.html",
  },
  {
    id: 3,
    title: "Zimní vybavení",
    area: "Skiareál Lipno",
    contact: "pokladny a infocentrum",
    summary: "Skipasy, výbava a návazný servis pro denní i večerní lyžování.",
    href: "https://www.lipno.info/oteviraci-a-provozni-doby-zima.html",
  },
];

export const lipnoInfoCenter = {
  title: "Infocentrum Lipno",
  phone: "+420 731 410 800",
  email: "infocentrum@lipno.info",
  address: "Lipno nad Vltavou 307, 382 78 Lipno nad Vltavou",
  hours: "Denně 8:00–16:00 / 16:30–19:30",
  parking: "Parkoviště P1: první 3 hodiny zdarma, potom 15 Kč za každou započatou hodinu.",
};

export const lipnoConditions = {
  weather: "-4 °C",
  snow: "85 cm",
  lifts: "4 lanovky",
  status: "Denní lyžování 8:30–16:00",
};

export const lipnoAiPrompts = [
  "Kde koupím vstupenky na Lipno?",
  "Jaká je otevírací doba Stezky?",
  "Kde najdu webkamery a počasí?",
  "Jak kontaktuji infocentrum?",
  "Co dělat s dětmi na Lipně?",
];
