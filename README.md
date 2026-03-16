# WebAPP

Dette projekt kan køres som en WebServer via Docker / Docker Compose.

## Krav

For at køre projektet skal følgende være installeret:

- Docker
- docker-compose

---

# Opsætning

Før du kan køre projektet, skal du oprette en `.env` fil.

Du kan enten:

- oprette en ny fil kaldet `.env`
- eller kopiere `.env.example` og omdøbe den
---

# Environment Variables

I `.env` filen skal følgende variabler defineres:

| Env Variable | Beskrivelse | Eksempel |
|---|---|---|
| APP_PORT | Port som WebServeren kører på | 2000 |
| PUBLIC_API | URL til WebAPI | https://api.com |

---

# Start WebServer

Når variablerne er defineret kan du starte serveren:

```bash
docker-compose up -d
```

Dette starter applikationen i baggrunden.

Herefter kan du åbne login siden i browseren:

```
http://localhost:APP_PORT
```

---

# Standard Bruger

Du kan teste login med følgende bruger:

| Rolle | Username | Password |
|---|---|---|
| Leder | Admin | 1234 |

---

# Stop Server

For at stoppe serveren:

```bash
docker-compose down
```

For også at fjerne containers og volumes:

```bash
docker-compose rm
```

---

# APP (Android)

Projektet er i øjeblikket kun sat op til Android, da der mangler testenheder til andre platforme.

---

# Krav

Følgende skal være installeret:

- Node.js
- npm
- Android Studio

---

# Installation

Først installeres dependencies:

```bash
npm install
```

---

# Build Android

Byg Android versionen:

```bash
npm run build:android
```

---

# Sync Capacitor

Synk Android projektet:

```bash
npx cap sync
```

---

# Åbn i Android Studio

Du kan enten åbne projektet manuelt i Android Studio, eller køre:

```bash
npx cap open android
```

Når dette er gjort, burde du have et fuldt fungerende Android projekt åbent i Android Studio, hvor du selv kan vælge hvordan du vil teste det.

## Pre‑bygget APK

Der findes en pre‑byggede Android APK i [releases](https://github.com/Lilf4/H5-Tvaerfaglig-WebApp/releases/tag/Android_APK) som kan installeres direkte på en enhed.
