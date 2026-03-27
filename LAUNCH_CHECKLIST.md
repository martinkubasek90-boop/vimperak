# Vimperak PWA Launch Checklist

## 1. Domena a hosting

- Nasadit aplikaci na finalni `https://` domenu.
- Overit, ze vsechny varianty URL vedou na jednu kanonickou adresu.
- Overit platny SSL certifikat bez warningu.
- Overit stabilni beh na mobilnich datech i na Wi-Fi.

## 2. PWA funkcnost

- Overit manifest v `public/manifest.json`.
- Overit service worker v `public/sw.js`.
- Overit registraci service workeru v `components/ServiceWorkerRegistrar.tsx`.
- Otestovat instalaci na `iPhone Safari`.
- Otestovat instalaci na `Android Chrome`.
- Otestovat otevreni aplikace ve `standalone` rezimu.
- Otestovat automatickou aktualizaci po novem deployi.

## 3. Obsah a UX

- Zkontrolovat, ze homepage jasne vysvetluje instalaci.
- Zkontrolovat navod v `app/instalace/page.tsx`.
- Pripravit verejnou URL pro sdileni a QR kod.
- Pripravit kratky text pro web mesta, Facebook a zpravodaj.
- Overit aktualnost dulezitych sekci: zpravy, kontakty, kalendar, hlaseni.

## 4. Notifikace

- Nastavit produkcni `VAPID` klice.
- Overit `NEXT_PUBLIC_VAPID_PUBLIC_KEY` v produkci.
- Otestovat subscribe a unsubscribe flow.
- Otestovat doruceni push notifikace na Androidu.
- Otestovat chovani na iPhonu podle aktualni verze iOS a Safari.
- Pripravit jednoduchy redakcni postup, kdo a jak notifikace posila.

## 5. Offline a vykon

- Otestovat otevreni aplikace bez signalu.
- Otestovat fallbacky pro API volani.
- Zkontrolovat velikost assetu a ikon.
- Spustit Lighthouse pro mobil a projit `PWA`, `Performance`, `Accessibility`, `Best Practices`.
- Overit, ze prvni nacteni neni pomale na slabsim telefonu.

## 6. Analytika a monitoring

- Pridat zakladni analytiku: navstevy, instalace, kliky na instalaci, zapnuti notifikaci.
- Pridat error monitoring pro produkci.
- Overit logovani chyb API endpointu.
- Nastavit alerting aspon na vypadek webu a kriticke API chyby.

## 7. Pravne a duveryhodnost

- Mit verejne dostupne Podminky a Zasady ochrany osobnich udaju.
- Pokud se sbiraji osobni data nebo push subscription, popsat to srozumitelne.
- U formularu a hlaseni mestu overit soulad s GDPR procesem.
- Pridat kontakt na spravce aplikace nebo podporu.

## 8. Distribuce

- Pripravit QR kod na finalni URL.
- Dat odkaz na web mesta.
- Dat odkaz do Facebook prispevku a mestskeho newsletteru.
- Pripravit 2 verze navodu:
- Kratka: 1 veta plus QR.
- Delsi: iPhone a Android kroky.

## 9. Release proces

- Pred kazdym releasem spustit `npm run build`.
- Mit jednoduchy release checklist: build, deploy, smoke test, update test, push test.
- Po deployi rucne overit `/`, `/instalace`, `/zpravodaj`, `/mesto`, `/zhlasit`.
- Overit, ze nova verze service workeru opravdu prebere rizeni.

## 10. Minimalni stav pred spustenim

- Finalni domena.
- Funkcni instalace na iPhone a Android.
- Funkcni automaticky update.
- Funkcni push notifikace aspon na Androidu.
- QR kod a komunikacni text pro obcany.
- Privacy policy a kontakt.
