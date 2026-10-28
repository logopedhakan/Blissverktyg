# Blissverktyget (WinBliss²)

Blissverktyget är WinBliss² i webbläsaren: en editor för Blissymboler, en skrivyta
som gör text till bliss, bildspel, övningar och gravyrkort. Allt körs i webbläsaren
och kan installeras som app (PWA). Den fungerar också utan nät när den har öppnats
en gång.

© 2026 AnyCom AB · koden under CC BY 4.0 · Blissymbolics © C.K. Bliss 1949, 1965 ·
symbolerna © Blissymbolics Communication International (BCI), CC BY-SA 4.0 —
följer BCI:s auktoriserade ordförråd (BCI-AV). <https://www.blissymbolics.org>
Se [LICENSE](LICENSE) för vad som gäller för koden och för symbolerna.

## Mappar

```
winbliss-web-beta/
├─ workbench/               själva appen — allt här publiceras
│  ├─ start.html            startsidan (appen öppnar här)
│  ├─ index.html            Editera och Skriv (index.html?vy=skriv)
│  ├─ skriv.html            Skriv utan menyer, för MindExpress m.fl. (skickar vidare till index.html?skriv=1)
│  ├─ bildspel.html         Bildspel — bild överst, blisstext under, PowerPoint-export
│  ├─ gissa.html            Hänga gubbe
│  ├─ former.html           Formfamiljer
│  ├─ gravyr.html           Gravyrkort för laser
│  ├─ manifest.webmanifest  appens namn, ikoner och genvägar
│  ├─ sw.js                 service worker: nätet först, cachen när nätet saknas
│  ├─ css/wb-base.css       gemensam palett (ljus/mörk) och ⌂ Start-länken
│  ├─ icons/                appikoner (gjorda med tools/make-icons.html)
│  └─ js/
│     ├─ engine/            ritmotorn, porterad från WinBliss (bliss-shapes, bliss-engine)
│     ├─ data/              BCI-AV: symbolerna (bliss-data) och översättningarna (glosses)
│     ├─ shared/            delas av alla delar: lang (språkval), wbs (.wbs-formatet),
│     │                     shortcuts ($-genvägar), pwa (installera appen)
│     └─ editor/            editorns kod (app, i18n)
├─ tools/                   utvecklingsverktyg — publiceras inte
│  ├─ serve.ps1             lokal testserver (behöver varken Python eller Node)
│  ├─ check-pwa.ps1         testar appen online och utan nät i en dold Edge
│  ├─ pwa-check.html        sidan som check-pwa.ps1 öppnar
│  ├─ make-icons.html       ritar appikonerna med bliss-motorn
│  └─ build-artifact.ps1    bygger Bildspel som claude.ai-artefakt (till dist/)
└─ .github/workflows/pages.yml   publicerar workbench/ till GitHub Pages
```

Sidorna ligger kvar direkt i `workbench/` så att gamla länkar och bokmärken
(till exempel `skriv.html?ordval=1&symbol=30` från MindExpress) fortsätter att fungera.

## Köra lokalt

```bash
powershell -ExecutionPolicy Bypass -File tools\serve.ps1
```

Öppna sedan <http://localhost:8765/start.html>. Appen och dess service worker
fungerar bara via `http://localhost` eller `https://`, inte genom att dubbelklicka
på filerna (`file://`). Sidorna i sig går att öppna så också, men då utan app och cache.

Testa appen online och utan nät (med servern igång):

```bash
powershell -ExecutionPolicy Bypass -File tools\check-pwa.ps1
```

## Lägga till en ny del

1. Lägg sidan direkt i `workbench/`, till exempel `workbench/ny-del.html`.
2. Kopiera huvudet från en befintlig del, till exempel `bildspel.html`: manifest-
   och ikonlänkarna, `css/wb-base.css` och skripten i samma ordning
   (`js/shared/lang.js`, `js/shared/pwa.js`, sedan motorn och datan).
3. Använd `wbLang()` för språket och `parseWbsText`/`decodeWbsBuffer` för egna
   ordlistor — skriv inte egna kopior.
4. Lägg till ett kort på `start.html`.
5. Lägg till sidan i `CORE` i `workbench/sw.js` och **höj `VERSION`**.

## Publicera en ny version

Varje gång du ändrar något i `workbench/`: höj `VERSION` i `workbench/sw.js`
(till exempel `2026-11-02.1`). Gör en commit och pusha till `main`. GitHub bygger
och publicerar då automatiskt, och de som har appen installerad får den nya
versionen nästa gång de öppnar den med nät.

Första gången, på GitHub: **Settings → Pages → Build and deployment → Source:
GitHub Actions**.
