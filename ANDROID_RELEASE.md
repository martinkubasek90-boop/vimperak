# Android Release Guide

## Co uz je hotove

- Android projekt je v `android/`
- debug build funguje
- release signing v `android/app/build.gradle` je pripraveny pres environment variables

## Co je potreba pripravit

### 1. Keystore

Vytvor Android keystore, ktery se bude pouzivat pro vsechny budouci release buildy.

Priklad:

```bash
keytool -genkeypair \
  -v \
  -keystore vimperaci-upload-keystore.jks \
  -alias vimperaci \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Tento soubor necommituj do repa.

### 2. Environment variables pro signing

Pred release buildem nastav:

```bash
export ANDROID_KEYSTORE_PATH="/absolute/path/to/vimperaci-upload-keystore.jks"
export ANDROID_KEYSTORE_PASSWORD="..."
export ANDROID_KEY_ALIAS="vimperaci"
export ANDROID_KEY_PASSWORD="..."
```

### 3. Local toolchain

Pro lokalni build je potreba:

- `JAVA_HOME`
- `ANDROID_HOME` nebo `android/local.properties`
- funkcni `Gradle`

Na tomto stroji byl pouzit:

```bash
export JAVA_HOME="/tmp/jdk-vimperak/jdk-21.0.10+7/Contents/Home"
export GRADLE_USER_HOME="/tmp/gradle-vimperak"
```

SDK je nastavene v `android/local.properties`.

## Release build

### APK

```bash
cd /Users/Mk/vimperk-app
GRADLE_USER_HOME=/tmp/gradle-vimperak \
JAVA_HOME=/tmp/jdk-vimperak/jdk-21.0.10+7/Contents/Home \
./android/gradlew -p android assembleRelease
```

Vystup:

- `android/app/build/outputs/apk/release/app-release.apk`

### AAB pro Google Play

Pro Google Play je lepsi `AAB`:

```bash
cd /Users/Mk/vimperk-app
GRADLE_USER_HOME=/tmp/gradle-vimperak \
JAVA_HOME=/tmp/jdk-vimperak/jdk-21.0.10+7/Contents/Home \
./android/gradlew -p android bundleRelease
```

Vystup:

- `android/app/build/outputs/bundle/release/app-release.aab`

## Google Play Internal Testing

1. Otevrit `Google Play Console`
2. Vytvorit aplikaci
3. Vyplnit zakladni store metadata
4. Otevrit `Testing` -> `Internal testing`
5. Vytvorit novy release
6. Nahrat `app-release.aab`
7. Pridat testery
8. Publikovat internal testing release

## Dalsi doporuceni pred uploadem

- nahradit defaultni Android ikony vlastnimi store ikonami
- otestovat release build na realnem telefonu
- pripravit `google-services.json`, pokud se bude pouzivat Firebase pro push
- zkontrolovat privacy policy URL a support URL
