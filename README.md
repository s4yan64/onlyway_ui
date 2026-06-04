# @onlyway/ui

Bibliothèque UI **partagée** des PWA onlyway (charte graphique commune).
**But : que toutes les apps soient identiques par construction** — on **importe** ces
composants, on ne les **copie plus**. Un `<SettingsPage>` rendu ici est le **même code
compilé** dans toutes les apps → zéro dérive possible.

> ⚠️ Ce package n'est **pas encore branché** dans les apps. Il est prêt ; la migration
> se fait quand tu veux (voir « Migration d'une app » plus bas). Aucune app n'est touchée.

## Contenu
- **Primitives** : `Button` `Card` `CardHeader` `CardTitle` `CardContent` `Input` `Textarea` `Select` `Label` `Badge` `PageTitle`
- **Layout** : `AppHeader` `PageContainer` `BottomNav` `ActionBar` `SaveButton` `AlertBanner` `PageHeaderRow` `Section` `SettingsPage`
- **Patterns** : `ThemeSelector` `SyncSection` `HistoryRow` `FloatingMenu`
- **Logique** : `cn` · thème (`getThemeChoice` `setThemeChoice` `watchSystemTheme` `THEME_INIT_SCRIPT`) · `useLongPress`
- **Tokens** : `@onlyway/ui/tokens.css` (couleurs OKLCH, typo, espaces, radius)

`react`, `react-dom`, `lucide-react` sont des **peerDependencies** (fournis par l'app).

## Build (une fois)
```bash
npm install
npm run build      # → dist/ (ESM + CJS + types)
```

## Installation dans une app (le jour de la migration)
Trois options selon ton setup (repos séparés, pas de monorepo) :
- **Registre privé** : `npm publish` puis `npm i @onlyway/ui` dans chaque app.
- **Dépendance git** : `npm i git+https://github.com/s4yan64/onlyway-ui.git`
- **Local (dev)** : `npm i file:../onlyway-ui` ou `npm link`.

### Brancher les tokens + Tailwind (par app)
1. Importer les tokens + la base une fois (ex. `main.tsx` / `app/layout.tsx`) :
   ```ts
   import "@onlyway/ui/tokens.css";
   import "@onlyway/ui/base.css";   // comportement app : pas de pinch-zoom, etc.
   ```
   Et le **meta viewport qui verrouille le zoom** (index.html / Next metadata) :
   ```html
   <meta name="viewport"
     content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
   ```
2. **Tailwind doit scanner le package** pour générer ses classes :
   - **v4** (`globals.css`) : `@source "../node_modules/@onlyway/ui/dist";`
   - **v3** (`tailwind.config`) : ajouter à `content` →
     `"./node_modules/@onlyway/ui/dist/**/*.{js,cjs,mjs}"`
3. Mapper les tokens en utilitaires Tailwind (couleurs, `max-w-content`, échelle typo) :
   voir le SKILL `charte_graphique_pwa` §2 (recettes v3 et v4 — identiques à aujourd'hui).
4. Injecter l'anti-flash thème dans `<head>` avant le 1er paint :
   ```ts
   import { THEME_INIT_SCRIPT } from "@onlyway/ui";
   // Vite: <script>{THEME_INIT_SCRIPT}</script> dans index.html
   // Next: <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
   ```

## Usage
```tsx
import {
  AppHeader, PageContainer, BottomNav, SettingsPage, Section,
  ThemeSelector, SyncSection, PageHeaderRow, HistoryRow, Button,
} from "@onlyway/ui";
import { ClipboardList, Plus, Settings } from "lucide-react";

// Châssis
<AppHeader appName="doc365" logoSrc="/icons/icon-192.png" />
<BottomNav
  active={vue}
  onNavigate={go}
  items={[
    { key: "historique", label: "Historique", icon: ClipboardList },
    { key: "nouveau",    label: "Nouveau",    icon: Plus },
    { key: "reglages",   label: "Réglages",   icon: Settings },
  ]}
/>

// Page Réglages — IDENTIQUE partout
<SettingsPage>
  <Section title="SYNCHRONISATION"><SyncSection {...sync} /></Section>
  <Section title="APPARENCE"><ThemeSelector /></Section>
  {/* ...sections spécifiques à l'app... */}
</SettingsPage>

// Page Historique
<PageContainer>
  <PageHeaderRow title="Historique" action={<Button><Plus className="h-4 w-4" />Nouveau</Button>} />
  <ul className="flex flex-col gap-2">{rows.map(r => <HistoryRow key={r.id} {...r} />)}</ul>
</PageContainer>
```

### Note Next.js
Les composants embarquent la directive `"use client"`. `AppHeader` utilise `<img>` ;
en Next, passe une URL statique ou wrappe `next/image` côté app si tu veux l'optimisation.

## Migration d'une app (plus tard, app par app)
1. Installer `@onlyway/ui` + brancher tokens/Tailwind (ci-dessus).
2. Remplacer les composants maison (`ui`, `Section`, `layout`, `patterns`) par les imports `@onlyway/ui`, **supprimer les copies locales**.
3. Recomposer Réglages (`SettingsPage` + `Section`) et Historique (`PageHeaderRow` + `HistoryRow`).
4. Build + vérif visuelle clair/sombre.

## Source de vérité
Ce package est généré depuis le skill `charte_graphique_pwa`. Toute évolution de la charte
se fait dans le package (puis `npm version` + republish) ; les apps mettent à jour la dépendance.
