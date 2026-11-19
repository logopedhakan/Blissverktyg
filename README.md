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
│  ├─ bildspel-ny.html      Nya bildspelet — samma bildspel och filer, nytt arbetssätt (symboler på
│  │                        knapparna, dra in bilder, ångra); sparar i samma webbläsarlager som Bildspel
│  ├─ gissa.html            Hänga gubbe
│  ├─ former.html           Formfamiljer
│  ├─ gravyr.html           Gravyrkort för laser
│  ├─ manifest.webmanifest  appens namn, ikoner och genvägar
│  ├─ sw.js                 service worker: nätet först, cachen när nätet saknas
│  ├─ css/wb-base.css       gemensam palett (ljus/mörk) och ⌂ Start-länken
│  ├─ css/wb-fonts.css      typsnittet Atkinson Hyperlegible, från appen själv (inte Google Fonts)
│  ├─ fonts/                typsnittsfilerna (woff2) och deras licens (SIL OFL 1.1)
│  ├─ icons/                appikoner (gjorda med tools/make-icons.html)
│  └─ js/
│     ├─ engine/            ritmotorn, porterad från WinBliss (bliss-shapes, bliss-engine)
│     ├─ data/              BCI-AV: symbolerna (bliss-data) och översättningarna (glosses),
│     │                     och från Bliss-glosor: ordlistan för skrivreglerna (bliss-skriv-data),
│     │                     synonymer (bliss-synonymer) och härledda verb (bliss-harledda)
│     ├─ shared/            delas av alla delar: lang (språkval), wbs (.wbs-formatet),
│     │                     shortcuts ($-genvägar), pwa (installera appen),
│     │                     blisstext (text → bliss i Bildspel, Gravyrkort och Almanacka),
│     │                     sv-morph (svensk böjning: barnen → barn + plural),
│     │                     bliss-skriv (Bliss-glosors skrivregler), bliss-grammar
│     │                     (indikatorernas placering) och skriv-glosor (kopplar
│     │                     skrivreglerna till Skriv och blisstext)
│     └─ editor/            editorns kod (app, i18n)
├─ tests/run.js             tester för text → bliss (node tests/run.js) — publiceras inte
├─ tools/                   utvecklingsverktyg — publiceras inte
│  ├─ serve.ps1             lokal testserver (behöver varken Python eller Node)
│  ├─ check-pwa.ps1         testar appen online och utan nät i en dold Edge
│  ├─ pwa-check.html        sidan som check-pwa.ps1 öppnar
│  ├─ make-icons.html       ritar appikonerna med bliss-motorn
│  ├─ build-skriv.js        hämtar skrivreglerna, grammatikmotorn och synonymerna från Bliss-glosor
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

## Tester

Tolkningen av text till bliss (svensk böjning, Skriv, Bildspel och Gravyrkort)
har tester med handskrivet facit. De kör sidornas riktiga skript och data och
behöver bara Node:

```bash
node tests/run.js
```

Kör dem efter ändringar i `js/shared/sv-morph.js`, `js/shared/blisstext.js`,
`js/shared/skriv-glosor.js` eller Skriv i `js/editor/app.js`. Bland testerna finns
Bliss-glosors 41 godkända meningar (`tests/fixtures/meningar.json`).

## Skrivreglerna kommer från Bliss-glosor

Skriv, Bildspel, Gravyrkort och Almanacka skriver svensk och engelsk text med
samma regler som Bliss-glosors "Skriv en egen mening": fraser som är en symbol
(*tycker om*), *ska* + verb (utelämna *ska* så får verbet framtidsform), artiklar
som kan utelämnas, BCI:s egennamn bara med stor bokstav, synonymer (Swesaurus) och
härledda verb (SUC 3.0). Skriver man ett plustecken mellan två ord (*fisk+pinne*,
*dum+skalle*) blir de ett sammansatt blissord, ritat som BCI:s egna: tecknen en kvarts
ruta isär, utan delarnas indikatorer. Indikatorerna placeras av samma grammatikmotor, så formerna
ritas exakt som där. Filerna ska inte ändras för hand — hämta en ny version med

```bash
node tools/build-skriv.js <sökväg till en klon av johbom/blissmaiker>
```

Skriptet kontrollerar först att ritmotorn och symboldatan är samma original som
Bliss-glosor låser, och sist att båda apparna skriver samma meningar likadant.

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
