# iOS Release Guide

## Aktualni stav projektu

- iOS wrapper existuje v `ios/App/`
- bundle identifier je `cz.vimperaci.app`
- verze je `1.0 (1)`
- simulator build i beh appky uz byly overene lokalne
- pro release sync pouzij `npm run cap:sync:ios:release`

## Co je hotove

- `@capacitor/ios` a nativni iOS projekt jsou v repu
- `AppDelegate.swift` uz obsahuje hooky pro registraci push tokenu
- app uz bezi v iOS simulatoru
- release konfigurace wrapperu uz defaultne miri na produkcni URL `https://vimperaci.cz`

## Co chybi pred TestFlight / App Store

### 1. Apple Developer signing

V [ios/App/App.xcodeproj/project.pbxproj](/Users/Mk/vimperk-app/ios/App/App.xcodeproj/project.pbxproj) zatim nevidim finalni `DEVELOPMENT_TEAM`.

Bez toho nejde:

- podepsat archive
- nahrat build do App Store Connect

### 2. App Store Connect zaznam

Je potreba vytvorit app v App Store Connect se stejnym:

- bundle id `cz.vimperaci.app`
- nazvem aplikace
- primarni kategorii

### 3. Push pro produkcni iOS

Klientska cast je pripravena, ale pro realne produkcni native push jeste potrebujes:

- APNs key
- Apple Team ID
- Key ID
- finalni produkcni APNs konfiguraci

V `.env.local` jsou na to uz pripravene promenne:

- `APNS_TEAM_ID`
- `APNS_KEY_ID`
- `APNS_PRIVATE_KEY`
- `APNS_BUNDLE_ID`

### 4. Store metadata

Apple bude chtit:

- privacy policy URL
- support URL
- screenshoty pro iPhone
- app description
- keywords
- app privacy odpovedi
- vekove hodnoceni

## Release sync

```bash
cd /Users/Mk/vimperk-app
npm run cap:sync:ios:release
```

## Upload do TestFlight

1. otevrit [App.xcworkspace](/Users/Mk/vimperk-app/ios/App/App.xcworkspace)
2. `Signing & Capabilities`
3. vybrat svuj Apple Team
4. overit bundle id `cz.vimperaci.app`
5. `Product > Archive`
6. po dokonceni `Distribute App`
7. `App Store Connect`
8. `Upload`

Po uploadu:

1. otevrit App Store Connect
2. `TestFlight`
3. pockat na processing buildu
4. pridat internim testerum

## Odeslani do App Store

1. v App Store Connect otevrit verzi aplikace
2. priradit nahrany build
3. vyplnit metadata a compliance
4. `Add for Review`
5. `Submit for Review`

## Co muze blokovat vydani

- chybi nastaveny Apple Team a distribucni signing
- bez App Store Connect recordu nejde build sparovat
- pokud budes chtit native push v prvnim releasu, je potreba dokoncit APNs konfiguraci
- screenshoty a app privacy odpovedi se bezne stanou poslednim realnym blockerem, ne kod

## Nejrychlejsi realny postup

1. nahrat prvni build do TestFlight
2. udelat kratky test na fyzickem iPhonu
3. doplnit metadata
4. poslat do review
