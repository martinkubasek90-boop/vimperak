-- ═══════════════════════════════════════════════════
--  VIMPERK APP — Initial Schema
-- ═══════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── EVENTS ──────────────────────────────────────────────────────────────────
create table public.events (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  date        date not null,
  time        time not null,
  place       text not null,
  category    text not null check (category in ('kultura','sport','kino','úřad','trhy')),
  free        boolean not null default true,
  price       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── NEWS ─────────────────────────────────────────────────────────────────────
create table public.news (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  summary     text not null,
  body        text,
  category    text not null check (category in ('radnice','sport','kultura','upozornění','komunita')),
  urgent      boolean not null default false,
  published_at timestamptz default now(),
  created_at  timestamptz default now()
);

-- ─── DIRECTORY ────────────────────────────────────────────────────────────────
create table public.directory (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  category    text not null check (category in ('taxi','restaurace','lékař','lékárna','opravna','sport','ubytování','obchod')),
  phone       text not null,
  address     text not null,
  hours       text,
  rating      numeric(2,1),
  note        text,
  created_at  timestamptz default now()
);

-- ─── BUS LINES ────────────────────────────────────────────────────────────────
create table public.bus_lines (
  id          uuid primary key default uuid_generate_v4(),
  number      text not null,
  from_stop   text not null,
  to_stop     text not null,
  departures  text[] not null,
  note        text
);

-- ─── POLLS ────────────────────────────────────────────────────────────────────
create table public.polls (
  id          uuid primary key default uuid_generate_v4(),
  question    text not null,
  category    text not null check (category in ('infrastruktura','kultura','doprava','obecné')),
  ends_at     date not null,
  created_at  timestamptz default now()
);

create table public.poll_options (
  id          uuid primary key default uuid_generate_v4(),
  poll_id     uuid not null references public.polls(id) on delete cascade,
  text        text not null,
  votes       integer not null default 0,
  sort_order  integer not null default 0
);

-- ─── REPORTS (Hlášení závad) ──────────────────────────────────────────────────
create table public.reports (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text not null,
  category    text not null check (category in ('komunikace','veřejné osvětlení','zeleň','odpad','jiné')),
  status      text not null default 'přijato' check (status in ('přijato','v řešení','vyřešeno','zamítnuto')),
  lat         numeric(9,6),
  lng         numeric(9,6),
  address     text,
  photo_url   text,
  reporter_email text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
alter table public.events    enable row level security;
alter table public.news      enable row level security;
alter table public.directory enable row level security;
alter table public.bus_lines enable row level security;
alter table public.polls     enable row level security;
alter table public.poll_options enable row level security;
alter table public.reports   enable row level security;

-- Public read access for all tables
create policy "Public read events"    on public.events    for select using (true);
create policy "Public read news"      on public.news      for select using (true);
create policy "Public read directory" on public.directory for select using (true);
create policy "Public read bus_lines" on public.bus_lines for select using (true);
create policy "Public read polls"     on public.polls     for select using (true);
create policy "Public read poll_options" on public.poll_options for select using (true);
create policy "Public read reports"   on public.reports   for select using (true);

-- Anyone can submit a report
create policy "Anyone can insert report" on public.reports for insert with check (true);

-- Anyone can vote (increment poll option)
create policy "Anyone can vote" on public.poll_options for update using (true);

-- ─── SEED DATA ────────────────────────────────────────────────────────────────

-- Bus lines
insert into public.bus_lines (number, from_stop, to_stop, departures, note) values
  ('190', 'Vimperk', 'České Budějovice', array['05:15','06:30','07:45','09:00','11:30','13:00','15:15','17:30','19:00'], 'Přes Prachatice'),
  ('191', 'Vimperk', 'Prachatice',        array['06:00','08:00','10:30','12:00','14:30','16:00','17:45','19:30'], null),
  ('195', 'Vimperk', 'Kašperské Hory',    array['07:20','09:45','12:15','14:00','16:20','18:00'], 'Šumava Express'),
  ('197', 'Vimperk', 'Volary',            array['06:45','09:15','11:00','13:30','15:00','17:00','19:15'], null);

-- Directory
insert into public.directory (name, category, phone, address, hours, rating, note) values
  ('Taxi Vimperk — Pavel Kotal', 'taxi', '602 111 222', 'Vimperk', '0–24 hod', 4.8, 'Disponibilní 24/7, odvoz na letiště Praha'),
  ('Taxi Šumava', 'taxi', '777 333 444', 'Vimperk', '6:00–22:00', 4.5, null),
  ('Restaurace Na Hradbách', 'restaurace', '388 412 001', 'Náměstí Svobody 12, Vimperk', '11:00–22:00', 4.3, 'Česká kuchyně, denní menu'),
  ('Pivnice U Jelena', 'restaurace', '388 412 120', 'Steinbrenerova 8, Vimperk', '11:00–23:00', 4.1, 'Domácí pivo, grilované speciality'),
  ('Šumavská kavárna', 'restaurace', '775 222 333', 'Náměstí Svobody 3, Vimperk', '8:00–18:00', 4.6, 'Snídaně, dezerty, káva'),
  ('MUDr. Jana Procházková — Praktický lékař', 'lékař', '388 412 300', 'Nemocniční 430, Vimperk', 'Po-Pá 7:30–12:00, Po+St 13:00–16:30', 4.7, null),
  ('MUDr. Tomáš Kovář — Dětský lékař', 'lékař', '388 412 310', 'Nemocniční 430, Vimperk', 'Po-Pá 7:30–12:00', 4.9, null),
  ('MUDr. Eva Horáková — Zubař', 'lékař', '388 412 350', 'Náměstí Svobody 18, Vimperk', 'Po-Čt 8:00–12:00, 13:00–16:00', 4.4, null),
  ('Lékárna Dobrá zdraví', 'lékárna', '388 412 400', 'Náměstí Svobody 2, Vimperk', 'Po-Pá 8:00–17:30, So 9:00–12:00', 4.5, null),
  ('Aquapark Vimperk', 'sport', '388 412 500', 'Špidrova 1, Vimperk', 'Po-Ne 9:00–21:00', 4.2, 'Krytý bazén, sauna, fitness');

-- News
insert into public.news (title, summary, category, urgent, published_at) values
  ('Uzavírka ulice Pivovarská — od 28. března', 'Z důvodu opravy vodovodu bude ulice Pivovarská uzavřena od 28. 3. do 15. 4. 2026. Objízdná trasa přes Steinbrenerovu.', 'upozornění', true, '2026-03-25'),
  ('Nová hřiště v parku Blanice — hlasování spuštěno', 'Radnice spustila hlasování o podobě nových dětských hřišť v parku Blanice. Hlasování trvá do 10. dubna.', 'radnice', false, '2026-03-24'),
  ('HC Vimperk slaví postup do krajské ligy!', 'Hokejisté Vimperka porazili Klatovy 4:2 a zajistili si postup do vyšší soutěže.', 'sport', false, '2026-03-23'),
  ('Jarní svoz nebezpečného odpadu — 5. dubna', 'Kontejnery přistaveny 5. dubna na náměstí Svobody od 9:00 do 13:00.', 'radnice', false, '2026-03-22'),
  ('Turistická sezóna na Šumavě se blíží', 'NP Šumava hlásí otevření všech pěších tras v okolí Vimperka od 1. dubna.', 'kultura', false, '2026-03-20');

-- Events
insert into public.events (title, description, date, time, place, category, free, price) values
  ('Vimperský jarmark', 'Tradiční jarní jarmark s místními řemeslníky, jídlem a zábavou pro děti.', '2026-04-05', '09:00', 'Náměstí Svobody', 'trhy', true, null),
  ('Kino: Anatole — CZ dabing', 'Animovaná rodinná komedie pro děti i rodiče.', '2026-03-28', '17:30', 'Kino Vimperk', 'kino', false, '130 Kč'),
  ('Kino: Rival — CZ titulky', 'Sportovní drama nominované na Oscara.', '2026-03-28', '20:00', 'Kino Vimperk', 'kino', false, '160 Kč'),
  ('Hokejový turnaj mládeže', 'Turnaj kategorie U12 a U14. Vstup zdarma pro diváky.', '2026-03-29', '10:00', 'Zimní stadion Vimperk', 'sport', true, null),
  ('Přednáška: Šumavská příroda', 'Přednáška fotografa Petra Nováka o životě zvířat v NP Šumava.', '2026-04-02', '18:00', 'Kulturní dům Vimperk', 'kultura', false, '80 Kč'),
  ('Veřejné zastupitelstvo', 'Zasedání zastupitelstva města. Veřejnost vítána.', '2026-04-07', '17:00', 'Radnice Vimperk', 'úřad', true, null);

-- Polls
with p as (
  insert into public.polls (question, category, ends_at) values
    ('Jakou podobu hřiště v parku Blanice preferujete?', 'infrastruktura', '2026-04-10')
  returning id
)
insert into public.poll_options (poll_id, text, votes, sort_order)
select p.id, opt.text, opt.votes, opt.ord from p,
  (values
    ('Moderní prolézačky a lezecká stěna', 187, 1),
    ('Tradiční houpačky a pískoviště', 94, 2),
    ('Multifunkční sportoviště (basketbal + pingpong)', 211, 3)
  ) as opt(text, votes, ord);

with p2 as (
  insert into public.polls (question, category, ends_at) values
    ('Jak jste spokojeni s frekvencí autobusů do Prachatic?', 'doprava', '2026-04-15')
  returning id
)
insert into public.poll_options (poll_id, text, votes, sort_order)
select p2.id, opt.text, opt.votes, opt.ord from p2,
  (values
    ('Velmi spokojen/a', 43, 1),
    ('Spíše spokojen/a', 89, 2),
    ('Spíše nespokojen/a', 156, 3),
    ('Velmi nespokojen/a', 201, 4)
  ) as opt(text, votes, ord);
