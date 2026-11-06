/* WinBliss² — Swedish morphology for writing text as Bliss: an inflected word
   -> its base form + which form it is (present, past, plural, definite …),
   validated against BCI-AV. Shared by Skriv (js/editor/app.js) and the shared
   word machine (js/shared/blisstext.js: Bildspel, Gravyrkort).
   Ported from the Bliss-glosor vocabulary trainer (johbom/blissmaiker,
   src/lemmatize.js + src/inflect.js, 2026-11), whose verb table in turn grew
   out of this project's own W_SV_VERBS (Håkan, 2026-10-15).

   THE HONESTY RULE, read in both directions: a wrong form is worse than the
   base form, and a wrong symbol is worse than text. An analysis only counts
   when its base form IS a Swedish BCI-AV gloss AND that symbol's word class
   fits the rule (verb -> RED, noun -> YELLOW/BLUE, adjective -> GREEN/WHITE).
   Otherwise the word stays text — a visible gap, never a guessed symbol.

   Rules cover the regular (about 9 in 10 running words); closed, curated
   tables carry the irregular. Ambiguities the rules cannot settle ("cyklar"
   verb or noun) come back as several analyses, best first; the word BEFORE
   may decide (contextPrefers). Needs BLISS_DATA and BLISS_GLOSSES; plain
   script, no modules, so it also runs from file:// and in Node tests. */
'use strict';
const SvMorph = (() => {

  /* ---- verbs: a curated table (strong verbs, group 2 and other closed classes) ---- */
  // base: [present, past, imperative]
  const SV_VERBS = {
    'vara': ['är', 'var', 'var'], 'ha': ['har', 'hade', 'ha'], 'bli': ['blir', 'blev', 'bli'],
    'gå': ['går', 'gick', 'gå'], 'stå': ['står', 'stod', 'stå'], 'få': ['får', 'fick', 'få'],
    'förstå': ['förstår', 'förstod', 'förstå'], 'se': ['ser', 'såg', 'se'], 'ge': ['ger', 'gav', 'ge'],
    'ta': ['tar', 'tog', 'ta'], 'dra': ['drar', 'drog', 'dra'], 'dö': ['dör', 'dog', 'dö'],
    'le': ['ler', 'log', 'le'], 'slå': ['slår', 'slog', 'slå'],
    'komma': ['kommer', 'kom', 'kom'], 'äta': ['äter', 'åt', 'ät'], 'dricka': ['dricker', 'drack', 'drick'],
    'sova': ['sover', 'sov', 'sov'], 'springa': ['springer', 'sprang', 'spring'],
    'sitta': ['sitter', 'satt', 'sitt'], 'ligga': ['ligger', 'låg', 'ligg'],
    'lägga': ['lägger', 'la', 'lägg'], 'sätta': ['sätter', 'satte', 'sätt'],
    'säga': ['säger', 'sa', 'säg'], 'göra': ['gör', 'gjorde', 'gör'], 'veta': ['vet', 'visste', 'vet'],
    'vilja': ['vill', 'ville'], 'kunna': ['kan', 'kunde'], 'finnas': ['finns', 'fanns'],
    'heta': ['heter', 'hette'], 'betyda': ['betyder', 'betydde'],
    'läsa': ['läser', 'läste', 'läs'], 'skriva': ['skriver', 'skrev', 'skriv'],
    'åka': ['åker', 'åkte', 'åk'], 'köra': ['kör', 'körde', 'kör'], 'ringa': ['ringer', 'ringde', 'ring'],
    'köpa': ['köper', 'köpte', 'köp'], 'tycka': ['tycker', 'tyckte', 'tyck'],
    'tänka': ['tänker', 'tänkte', 'tänk'], 'känna': ['känner', 'kände', 'känn'],
    'höra': ['hör', 'hörde', 'hör'], 'hjälpa': ['hjälper', 'hjälpte', 'hjälp'],
    'leka': ['leker', 'lekte', 'lek'], 'söka': ['söker', 'sökte', 'sök'], 'byta': ['byter', 'bytte', 'byt'],
    'stänga': ['stänger', 'stängde', 'stäng'], 'möta': ['möter', 'mötte', 'möt'],
    'leva': ['lever', 'levde', 'lev'], 'välja': ['väljer', 'valde', 'välj'],
    'sälja': ['säljer', 'sålde', 'sälj'], 'falla': ['faller', 'föll', 'fall'],
    'hålla': ['håller', 'höll', 'håll'], 'bjuda': ['bjuder', 'bjöd', 'bjud'],
    'sjunga': ['sjunger', 'sjöng', 'sjung'], 'gråta': ['gråter', 'grät', 'gråt'],
    'vinna': ['vinner', 'vann', 'vinn'], 'brinna': ['brinner', 'brann', 'brinn'],
    'flyga': ['flyger', 'flög', 'flyg'], 'rida': ['rider', 'red', 'rid'],
    'krypa': ['kryper', 'kröp', 'kryp'], 'bita': ['biter', 'bet', 'bit'],
    'blåsa': ['blåser', 'blåste', 'blås'], 'frysa': ['fryser', 'frös', 'frys'],
    'växa': ['växer', 'växte', 'väx'], 'behöva': ['behöver', 'behövde', 'behöv'],
    'följa': ['följer', 'följde', 'följ'], 'glömma': ['glömmer', 'glömde', 'glöm'],
    'gömma': ['gömmer', 'gömde', 'göm'], 'resa': ['reser', 'reste', 'res'],
    'bära': ['bär', 'bar', 'bär'], 'skära': ['skär', 'skar', 'skär'], 'stiga': ['stiger', 'steg', 'stig'],
    'lyfta': ['lyfter', 'lyfte', 'lyft'], 'trycka': ['trycker', 'tryckte', 'tryck'],
    'släppa': ['släpper', 'släppte', 'släpp'], 'klippa': ['klipper', 'klippte', 'klipp'],
    'bygga': ['bygger', 'byggde', 'bygg'], 'riva': ['river', 'rev', 'riv'],
    'skjuta': ['skjuter', 'sköt', 'skjut'], 'steka': ['steker', 'stekte', 'stek'],
    'skölja': ['sköljer', 'sköljde', 'skölj'], 'gräva': ['gräver', 'grävde', 'gräv'],
    'drömma': ['drömmer', 'drömde', 'dröm'], 'svälja': ['sväljer', 'svalde', 'svälj'],
    'räcka': ['räcker', 'räckte', 'räck'], 'väga': ['väger', 'vägde', 'väg'],
    'mäta': ['mäter', 'mätte', 'mät'], 'lära': ['lär', 'lärde', 'lär'],
    'skrika': ['skriker', 'skrek', 'skrik'], 'kyssa': ['kysser', 'kysste', 'kyss'],
    'störa': ['stör', 'störde', 'stör'], 'böja': ['böjer', 'böjde', 'böj'],
    'stryka': ['stryker', 'strök', 'stryk'], 'hänga': ['hänger', 'hängde', 'häng'],
    'finna': ['finner', 'fann', 'finn'], 'binda': ['binder', 'band', 'bind'], 'fara': ['far', 'for', 'far'],
    'ljuga': ['ljuger', 'ljög', 'ljug'], 'skina': ['skiner', 'sken', 'skin'], 'slita': ['sliter', 'slet', 'slit'],
    'stjäla': ['stjäl', 'stal', 'stjäl'], 'svära': ['svär', 'svor', 'svär'], 'tiga': ['tiger', 'teg', 'tig'],
    'dölja': ['döljer', 'dolde', 'dölj'], 'äga': ['äger', 'ägde', 'äg'], 'bryta': ['bryter', 'bröt', 'bryt'],
    'driva': ['driver', 'drev', 'driv'], 'duga': ['duger', 'dög', 'dug'], 'fly': ['flyr', 'flydde', 'fly'],
    'gälla': ['gäller', 'gällde', 'gäll'], 'knyta': ['knyter', 'knöt', 'knyt'], 'smyga': ['smyger', 'smög', 'smyg'],
    'sy': ['syr', 'sydde', 'sy'], 'bo': ['bor', 'bodde', 'bo'], 'tro': ['tror', 'trodde', 'tro'],
    'må': ['mår', 'mådde', 'må'], 'klä': ['klär', 'klädde', 'klä'], 'be': ['ber', 'bad', 'be'],
    'hinna': ['hinner', 'hann', 'hinn'], 'lida': ['lider', 'led', 'lid'], 'rinna': ['rinner', 'rann', 'rinn'],
    'slippa': ['slipper', 'slapp', 'slipp'], 'skola': ['ska', 'skulle'], 'böra': ['bör', 'borde'],
    'låta': ['låter', 'lät', 'låt'],
  };

  /* Swedish surface form under the symbol for the chosen tense indicator, or
     null = keep the base form (a wrong form is worse than the base form). */
  function svInflect(base, keys, sym) {
    const tense = keys.includes('past_action') ? 1 : keys.includes('present_action') ? 0
                : keys.includes('future_action') ? 2 : keys.includes('imperative_form') ? 3 : -1;
    if (tense < 0) return null;
    const b = String(base || '').toLowerCase().trim();
    if (!b || /\s/.test(b)) return null;
    if (tense === 2) return 'ska ' + b;               // analytic future — always safe
    const t = SV_VERBS[b];
    if (t) return t[tense === 3 ? 2 : tense] || null;
    if (b.endsWith('s')) return null;                 // deponent verbs (hoppas, trivas): leave as written
    if (!sym || sym.c !== 'RED') return null;         // the rules below only trust real verbs
    if (b.endsWith('a') && b.length > 2)              // the productive class: hoppa -> hoppar/hoppade
      return tense === 0 ? b + 'r' : tense === 1 ? b + 'de' : b;
    if (/[åäöoueiy]$/.test(b))                        // vowel verbs: bo -> bor/bodde, tro, må, sy, klä
      return tense === 0 ? b + 'r' : tense === 1 ? b + 'dde' : b;
    return null;
  }

  /* The table read backwards — a closed class, so safe: "åt" -> äta (past),
     "är" -> vara (present), "vill" -> vilja. A form may have several ("var" =
     vara past / imperative): all are returned, past before imperative. */
  let LEMMAS = null;
  const FORM_KEYS = ['present_action', 'past_action', 'imperative_form'];
  function svFormsOf(form) {
    if (!LEMMAS) {
      LEMMAS = new Map();
      for (const [base, forms] of Object.entries(SV_VERBS)) {
        forms.forEach((f, i) => {
          if (!f || f === base) return;
          if (!LEMMAS.has(f)) LEMMAS.set(f, []);
          const list = LEMMAS.get(f);
          if (!list.some(x => x.base === base)) list.push({ base, key: FORM_KEYS[i] });
        });
      }
    }
    return (LEMMAS.get(String(form || '').toLowerCase().trim()) || []).slice();
  }

  /* ---- nouns and adjectives ---- */
  // word classes a rule may land on (hel/all are function words in BCI-AV)
  const POS_CLASSES = { V: ['RED'], N: ['YELLOW', 'BLUE'], A: ['GREEN', 'WHITE'] };

  /* Common NEUTER nouns ending in a consonant: for them "-en" is definite
     PLURAL (barnen, husen), for common-gender nouns definite singular (bilen).
     BCI-AV has no gender, so this is a curated list; a word not in it reads
     "-en" as definite singular. */
  const NEUTER = new Set(('barn hus bord ben träd rum tak golv fönster land hål hav kök mål par plan pris ris skal ' +
    'skepp slag spel svar sår tåg tält tecken kors lås lån mjöl papper foto kort ljus ljud glas bad blad brev bröd ' +
    'djur fel fjäll fält frö gift hjul hår huvud hörn jobb knä kvarter lager lag lejon läger mynt märke möte namn ' +
    'nät ord område paket parti program rep rör språk steg tal underverk vin vete väder yrke år ägg öl dike ' +
    'exempel medel mönster tema konto ställe tillfälle äpple päron').split(/\s+/));

  // irregular noun forms: form -> [base, keys]
  const NOUN_IRR = {
    'män': ['man', ['plural']], 'männen': ['man', ['plural', 'definite_form']],
    'fötter': ['fot', ['plural']], 'fötterna': ['fot', ['plural', 'definite_form']],
    'tänder': ['tand', ['plural']], 'tänderna': ['tand', ['plural', 'definite_form']],
    'böcker': ['bok', ['plural']], 'böckerna': ['bok', ['plural', 'definite_form']],
    'händer': ['hand', ['plural']], 'händerna': ['hand', ['plural', 'definite_form']],
    'bröder': ['bror', ['plural']], 'bröderna': ['bror', ['plural', 'definite_form']],
    'systrar': ['syster', ['plural']], 'systrarna': ['syster', ['plural', 'definite_form']],
    'döttrar': ['dotter', ['plural']], 'döttrarna': ['dotter', ['plural', 'definite_form']],
    'söner': ['son', ['plural']], 'sönerna': ['son', ['plural', 'definite_form']],
    'ögon': ['öga', ['plural']], 'ögonen': ['öga', ['plural', 'definite_form']],
    'öron': ['öra', ['plural']], 'öronen': ['öra', ['plural', 'definite_form']],
    'gäss': ['gås', ['plural']], 'möss': ['mus', ['plural']],
    'bönder': ['bonde', ['plural']], 'bönderna': ['bonde', ['plural', 'definite_form']],
    'städer': ['stad', ['plural']], 'städerna': ['stad', ['plural', 'definite_form']],
    'länder': ['land', ['plural']], 'länderna': ['land', ['plural', 'definite_form']],
    'nätter': ['natt', ['plural']], 'nätterna': ['natt', ['plural', 'definite_form']],
    'stränder': ['strand', ['plural']], 'rötter': ['rot', ['plural']], 'kvinnorna': ['kvinna', ['plural', 'definite_form']],
    // doubled consonants the rules do not see: man -> mannen, himmel -> himlen
    'mannen': ['man', ['definite_form']],
    'himlen': ['himmel', ['definite_form']], 'himlar': ['himmel', ['plural']], 'himlarna': ['himmel', ['plural', 'definite_form']],
  };

  // irregular adjectives/adverbs: form -> [base, keys] (BCI has no comparative indicator: keys empty)
  const ADJ_IRR = {
    'bättre': ['bra', []], 'bäst': ['bra', []], 'bästa': ['bra', []],
    'större': ['stor', []], 'störst': ['stor', []], 'största': ['stor', []],
    'mindre': ['liten', []], 'minst': ['liten', []], 'minsta': ['liten', []],
    'litet': ['liten', []], 'lilla': ['liten', []], 'små': ['liten', []],
    'äldre': ['gammal', []], 'äldst': ['gammal', []], 'äldsta': ['gammal', []], 'gamla': ['gammal', []], 'gammalt': ['gammal', []],
    'yngre': ['ung', []], 'yngst': ['ung', []], 'yngsta': ['ung', []],
    'sämre': ['dålig', []], 'sämst': ['dålig', []], 'sämsta': ['dålig', []],
    'mer': ['mycket', []], 'mest': ['mycket', []], 'fler': ['många', []], 'flest': ['många', []],
    'goda': ['god', []], 'gott': ['god', []], 'gärna': ['gärna', []],
  };

  // syncope: fågl- -> fågel, fönstr- -> fönster, cykl- -> cykel
  const syncope = (stem) => (/[^aeiouyåäö][lnr]$/.test(stem) ? stem.slice(0, -1) + 'e' + stem.slice(-1) : null);

  /* Suffix rules. `add` = what goes on the stem to give the base form (several
     = several possible stems, pojkar -> pojk+e; '*e' = syncope). `keys` = BCI
     indicator keys. Lower `pri` = preferred. */
  const RULES = [
    // verbs: past (weak)
    { suf: 'ade', add: ['a'], keys: ['past_action'], pos: 'V', pri: 3 },
    { suf: 'dde', add: [''], keys: ['past_action'], pos: 'V', pri: 7 },
    { suf: 'de', add: ['a', ''], keys: ['past_action'], pos: 'V', pri: 7 },
    { suf: 'te', add: ['a', ''], keys: ['past_action'], pos: 'V', pri: 7 },
    // verbs: present
    { suf: 'ar', add: ['a'], keys: ['present_action'], pos: 'V', pri: 4 },
    { suf: 'er', add: ['a', ''], keys: ['present_action'], pos: 'V', pri: 5 },
    { suf: 'r', add: [''], keys: ['present_action'], pos: 'V', pri: 6 },
    // nouns: definite plural, plural, definite singular
    { suf: 'orna', add: ['a'], keys: ['plural', 'definite_form'], pos: 'N', pri: 10 },
    { suf: 'arna', add: ['', 'e', 'a', '*e'], keys: ['plural', 'definite_form'], pos: 'N', pri: 10 },
    { suf: 'erna', add: ['', 'e', '*e'], keys: ['plural', 'definite_form'], pos: 'N', pri: 10 },
    { suf: 'ena', add: ['', 'e'], keys: ['plural', 'definite_form'], pos: 'N', pri: 11 },
    { suf: 'na', add: [''], keys: ['plural', 'definite_form'], pos: 'N', pri: 12 },
    { suf: 'or', add: ['a'], keys: ['plural'], pos: 'N', pri: 12 },
    { suf: 'ar', add: ['', 'e', 'a', '*e'], keys: ['plural'], pos: 'N', pri: 12 },
    { suf: 'er', add: ['', 'e', '*e'], keys: ['plural'], pos: 'N', pri: 4.5 },
    { suf: 'en', add: ['', '*e'], keys: ['definite_form'], pos: 'N', pri: 13, genus: true },   // bilen; öknen -> öken
    { suf: 'et', add: ['', '*e'], keys: ['definite_form'], pos: 'N', pri: 13 },               // huset; fönstret -> fönster
    { suf: 't', add: [''], keys: ['definite_form'], pos: 'N', pri: 14, vowelEnd: true },       // äpplet -> äpple (not högt -> hög)
    { suf: 'n', add: [''], keys: ['definite_form'], pos: 'N', pri: 14, nStem: true },          // flickan -> flicka, äpplen -> äpple
    // adjectives (and adverbs in -t)
    { suf: 'tt', add: ['d', 't'], keys: [], pos: 'A', pri: 20 },             // glatt -> glad, vitt -> vit
    { suf: 't', add: [''], keys: [], pos: 'A', pri: 21 },                    // stort -> stor, snabbt -> snabb
    { suf: 'a', add: [''], keys: [], pos: 'A', pri: 22 },                    // stora -> stor
    { suf: 'are', add: ['', 'e'], keys: [], pos: 'A', pri: 23 },
    { suf: 'aste', add: ['', 'e'], keys: [], pos: 'A', pri: 23 },
    { suf: 'ast', add: ['', 'e'], keys: [], pos: 'A', pri: 23 },
    // verbs: supine/participle (no BCI indicator here: the label carries the form)
    { suf: 'ande', add: ['a'], keys: ['present_participle'], pos: 'V', pri: 30 },
    { suf: 'ende', add: ['a', ''], keys: ['present_participle'], pos: 'V', pri: 30 },
    { suf: 'it', add: ['a', ''], keys: [], pos: 'V', pri: 31 },              // sjungit -> sjunga
    { suf: 'at', add: ['a'], keys: [], pos: 'V', pri: 31 },                  // hoppat -> hoppa
    { suf: 'ad', add: ['a'], keys: [], pos: 'V', pri: 32 },                  // älskad -> älska
    { suf: 't', add: ['a', ''], keys: [], pos: 'V', pri: 33 },               // köpt -> köpa, läst -> läsa
    // genitive (BCI-AV has no current possessive indicator)
    { suf: 's', add: [''], keys: [], pos: 'N', pri: 90, possessive: true },
  ];

  /* token: the word as written. senses(base) -> BCI entries [{c, id}] for a
     base form, best first. Returns [{lemma, keys, pos, rule, pri, entry, senses}],
     best first; empty when nothing validates. */
  function analyze(token, senses) {
    const t = String(token || '').toLowerCase().trim();
    if (t.length < 2) return [];
    const out = [];
    const seen = new Set();
    const take = (lemma, keys, pos, rule, pri, extra) => {
      const classes = POS_CLASSES[pos];
      const entries = (senses(lemma) || []).filter(e => classes.includes(e.c));
      if (!entries.length) return;
      const id = lemma + '|' + keys.join('+') + '|' + pos;
      if (seen.has(id)) return;
      seen.add(id);
      const weak = pos === 'A' && entries[0].c === 'WHITE';    // a function-word hit: after real adjectives
      out.push(Object.assign({ lemma, keys, pos, rule, pri: pri + (weak ? 5 : 0), entry: entries[0], senses: entries }, extra));
    };
    // 1) irregular verbs (closed, curated class)
    for (const { base, key } of svFormsOf(t)) take(base, [key], 'V', 'irr-verb', 1);
    // 2) irregular nouns/adjectives
    if (NOUN_IRR[t]) take(NOUN_IRR[t][0], NOUN_IRR[t][1], 'N', 'irr-noun', 2);
    if (ADJ_IRR[t]) take(ADJ_IRR[t][0], ADJ_IRR[t][1], 'A', 'irr-adj', 2);
    // 3) regular endings
    for (const r of RULES) {
      if (!t.endsWith(r.suf)) continue;
      const stem = t.slice(0, t.length - r.suf.length);
      if (stem.length < 1) continue;
      for (const add of r.add) {
        let lemma0;
        if (add === '*e') { lemma0 = syncope(stem); if (!lemma0) continue; }
        else lemma0 = stem + add;
        // doubled consonant in the inflection: rummet -> rum, mannen -> man
        const lemmas = add === '' && r.pos === 'N' && /(mm|nn)$/.test(lemma0) ? [lemma0, lemma0.slice(0, -1)] : [lemma0];
        for (const lemma of lemmas) {
          if (lemma.length < 2 || lemma === t) continue;
          let keys = r.keys;
          const extra = {};
          if (r.possessive) extra.possessive = true;
          if (r.genus) {
            // "-en": neuter -> definite plural, otherwise definite singular
            if (NEUTER.has(lemma)) keys = ['plural', 'definite_form'];
            else extra.ambiguous = true;
          }
          if (r.vowelEnd && !/[aeiouyåäö]$/.test(lemma)) continue;
          if (r.nStem) {
            // flickan (stem in -a) = definite singular; stem in -e: neuter (äpple -> äpplen) = plural,
            // else common gender (läraren, pojken) = definite singular; fågeln/cykeln = definite singular
            if (/e$/.test(lemma)) keys = NEUTER.has(lemma) ? ['plural'] : ['definite_form'];
            else if (/(el|en|er)$/.test(lemma)) keys = ['definite_form'];
            else if (!/a$/.test(lemma)) continue;
          }
          take(lemma, keys, r.pos, `${r.pos}:-${r.suf}`, r.pri, extra);
        }
      }
    }
    out.sort((a, b) => a.pri - b.pri);
    return out;
  }

  /* the word BEFORE settles verb/noun ambiguity ("två cyklar" / "han cyklar") */
  const NOUN_CTX = new Set(('en ett två tre fyra fem sex sju åtta nio tio många några flera alla båda mina dina sina våra era ' +
    'deras dessa min din sin vår mitt ditt sitt stora små nya gamla röda gröna blå gula vita svarta fina snälla').split(/\s+/));
  const VERB_CTX = new Set(('jag du han hon vi ni de man som kan ska vill måste får brukar inte också sedan sen då nu ' +
    'aldrig alltid ofta ibland gärna').split(/\s+/));
  function contextPrefers(prev) {
    const p = String(prev || '').toLowerCase().trim();
    if (!p) return null;
    if (NOUN_CTX.has(p)) return 'N';
    if (VERB_CTX.has(p)) return 'V';
    return null;
  }

  /* ---- Blissverktyget: lookup in the Swedish BCI-AV glosses ---- */
  let SV_INDEX = null;
  const CLASS = new Map();
  const PRONOUN = new Set();
  const EN_PRONOUNS = new Set(['i', 'me', 'you', 'he', 'she', 'it', 'we', 'they', 'him', 'her', 'us', 'them', 'one']);
  function svIndex() {
    if (SV_INDEX) return SV_INDEX;
    SV_INDEX = new Map();
    for (const s of BLISS_DATA) {
      CLASS.set(s.id, s.c);
      if (s.c === 'BLUE' && (s.n || '').split(',').some(n => EN_PRONOUNS.has(n.trim().toLowerCase()))) PRONOUN.add(s.id);
    }
    const sv = (typeof BLISS_GLOSSES !== 'undefined' && BLISS_GLOSSES.sv) || {};
    for (const [id, g] of Object.entries(sv)) {
      if (!CLASS.has(+id)) continue;
      g.split(',').forEach((syn, i) => {
        // head word (first gloss) before later synonyms; BCI's "(…)" qualifier dropped as a second key
        for (const k of new Set([syn.trim().toLowerCase(), syn.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase()])) {
          if (!k) continue;
          if (!SV_INDEX.has(k)) SV_INDEX.set(k, []);
          SV_INDEX.get(k).push({ id: +id, c: CLASS.get(+id), head: i === 0 });
        }
      });
    }
    for (const arr of SV_INDEX.values()) arr.sort((a, b) => (b.head - a.head) || (a.id - b.id));
    return SV_INDEX;
  }
  const senses = (lemma) => svIndex().get(lemma) || [];

  /* Forms a symbol gets by default, as in the approved sentences of the
     vocabulary trainer: plural and past carry BCI's indicator; present tense
     and the definite form are written without one. */
  const DEFAULT_FORMS = ['past_action', 'plural'];

  /* An inflected Swedish word -> candidate symbols, best first:
     [{ id, lemma, ind }] where ind is the indicator key to start with ('' =
     none). `prev` is the word before (verb/noun context). Empty when no
     analysis validates — the caller keeps the word as text. */
  function resolve(word, prev) {
    let an = analyze(word, senses);
    if (an.length > 1) {
      const want = contextPrefers(prev);
      if (want) an = [...an.filter(a => a.pos === want), ...an.filter(a => a.pos !== want)];
    }
    const out = [];
    for (const a of an) {
      // an inflected noun (mannen, männen) is not the pronoun spelt the same (man = one): pronouns last
      const ss = a.pos === 'N' ? [...a.senses.filter(s => !PRONOUN.has(s.id)), ...a.senses.filter(s => PRONOUN.has(s.id))] : a.senses;
      const ind = DEFAULT_FORMS.filter(k => a.keys.includes(k)).join('+');
      for (const s of ss.slice(0, 3))
        if (!out.some(o => o.id === s.id)) out.push({ id: s.id, lemma: a.lemma, ind });
      if (out.length >= 8) break;
    }
    return out;
  }

  return { SV_VERBS, svInflect, svFormsOf, analyze, contextPrefers, resolve, senses };
})();
