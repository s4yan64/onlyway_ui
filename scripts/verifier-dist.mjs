/**
 * Le `dist` publié porte-t-il vraiment ce qu'il doit porter ?
 *
 * Lancé par `prepublishOnly` : une publication ne peut plus emporter un paquet
 * silencieusement cassé.
 *
 * POURQUOI CE FICHIER EXISTE : la version 0.1.1 était installable, importable,
 * et **inutilisable depuis Next** — l'option `treeshake` de tsup supprimait la
 * directive `"use client"` que la configuration déclarait pourtant. Le `dist`
 * publié n'en contenait aucune. Ni le build, ni le typecheck, ni l'installation
 * ne le signalaient : il fallait ouvrir le fichier compilé pour le voir.
 */
import { existsSync, readFileSync } from "node:fs";

let echecs = 0;
const ok = (m) => console.log(`  ok      ${m}`);
const ko = (m) => {
  echecs++;
  console.log(`  ECHEC   ${m}`);
};

console.log("\nVÉRIFICATION DU DIST\n");

for (const f of ["dist/index.js", "dist/index.cjs", "dist/index.d.ts", "dist/index.d.cts"]) {
  existsSync(f) ? ok(f) : ko(`${f} manquant`);
}

// Le contrôle qui compte : la directive doit être la PREMIÈRE instruction.
for (const f of ["dist/index.js", "dist/index.cjs"]) {
  if (!existsSync(f)) continue;
  const tete = readFileSync(f, "utf8").slice(0, 200);
  /^\s*["']use client["']/.test(tete)
    ? ok(`"use client" en tête de ${f}`)
    : ko(`"use client" ABSENT de ${f} — inutilisable depuis l'App Router`);
}

// Les feuilles de style font partie du contrat : une app les importe par leur
// chemin d'export, et leur absence ne se voit qu'à l'écran, en production.
for (const f of ["src/styles/design-tokens.css", "src/styles/base.css"]) {
  existsSync(f) ? ok(f) : ko(`${f} manquant`);
}

// Les composants du paquet utilisent `safe-top` / `safe-bottom`. Ces classes
// ne sont PAS des utilitaires Tailwind : si base.css cesse de les définir, la
// barre du bas repasse sous l'indicateur d'accueil de l'iPhone, sans erreur.
const base = existsSync("src/styles/base.css") ? readFileSync("src/styles/base.css", "utf8") : "";
const dist = existsSync("dist/index.js") ? readFileSync("dist/index.js", "utf8") : "";
// ⚠️ `above-nav` depuis la 0.4.0 : même nature, même risque. Sans elle, le panier
// ancré tombe à `bottom: auto` et se colle en HAUT de l'écran — sans erreur.
for (const classe of ["safe-top", "safe-bottom", "above-nav"]) {
  if (!dist.includes(classe)) continue; // non utilisée : rien à garantir
  base.includes(`.${classe}`)
    ? ok(`.${classe} définie dans base.css`)
    : ko(`.${classe} utilisée par un composant mais ABSENTE de base.css`);
}

// Un échantillon d'exports : si le point d'entrée a changé de forme, on le sait.
const src = existsSync("dist/index.js") ? readFileSync("dist/index.js", "utf8") : "";
for (const e of [
  "AnchoredBar",
  "InlineNotice",
  "HistoryList",
  "HistoryRow",
  "ReasonPicker",
  "Button",
  "Card",
  "Input",
  "AppHeader",
  "PageContainer",
  "BottomNav",
  "AlertBanner",
  "ThemeSelector",
  "THEME_INIT_SCRIPT",
  "cn",
  "Dialog",
  "Tabs",
  "TabsList",
  "TabsTrigger",
  "TabsContent",
  "Switch",
  "Checkbox",
  "DropdownMenu",
  "DropdownMenuItem",
  "Table",
  "TableHeader",
  "TableBody",
  "TableRow",
  "TableHead",
  "TableCell",
  "TableEmpty",
]) {
  src.includes(e) ? ok(`export ${e}`) : ko(`export ${e} introuvable`);
}

console.log(echecs === 0 ? "\n  dist conforme\n" : `\n  ${echecs} problème(s)\n`);
process.exit(echecs === 0 ? 0 : 1);
