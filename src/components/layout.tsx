// Composants de mise en page canoniques — IDENTIQUES sur toutes les PWA.
// AppHeader (h-14 logo+nom), PageContainer (max-w-content), BottomNav (3 onglets),
// ActionBar (Enregistrer fixe bas), AlertBanner (haut de page),
// PageHeaderRow (titre de page + action), Section (bloc de réglages), SettingsPage.
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Save, X } from "lucide-react";
import { cn } from "../lib/cn";
import { Button, PageTitle } from "./ui";

/* --------------------------------------------------------------- AppHeader
   Barre d'app : hauteur FIXE h-14, logo + nom de l'app SEULS (pas de sous-titre,
   pas de titre de page). Contenu aligné sur max-w-content (= largeur du contenu).
   Next.js : remplacer <img> par next/image. */
export function AppHeader({ appName, logoSrc }: { appName: string; logoSrc: string }) {
  return (
    // `min-h-14` et non `h-14` : en border-box, le padding de zone sûre
    // mangerait la hauteur au lieu de l'ajouter, et le titre passerait sous
    // l'encoche de l'iPhone.
    <header className="safe-top sticky top-0 z-30 min-h-14 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-content items-center gap-2.5 px-4">
        <img src={logoSrc} alt="" className="h-7 w-7 shrink-0 rounded-md" />
        <span className="text-base font-semibold text-foreground">{appName}</span>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------- PageContainer
   Conteneur de contenu centré, largeur de référence max-w-content. pb pour le bottom nav. */
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn("mx-auto w-full max-w-content px-4 pb-24 pt-4", className)}>{children}</main>
  );
}

/* --------------------------------------------------------------- BottomNav
   3 onglets, ordre FIXE : Historique (gauche) · centre · Réglages (droite).
   `active` = clé de l'onglet courant. onNavigate(key) gère la navigation/route. */
export interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
}
export function BottomNav({
  items,
  active,
  onNavigate,
}: {
  items: NavItem[]; // exactement 3, dans l'ordre Historique · centre · Réglages
  active: string;
  onNavigate: (key: string) => void;
}) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-md">
      {/* ⚠️ Le nombre de colonnes SUIT le nombre d'entrées, il ne se décide pas
          ici : `grid-cols-3` en dur renvoyait la quatrième entrée à la ligne,
          sous la barre, hors de l'écran. Et il ne peut pas être une classe
          Tailwind calculée — le compilateur ne voit que les classes écrites en
          toutes lettres, `grid-cols-${n}` ne serait jamais généré. */}
      <ul
        className="mx-auto grid w-full max-w-content"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map(({ key, label, icon: Icon }) => {
          const on = key === active;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onNavigate(key)}
                className={cn(
                  // Hauteur portée par `--nav-h` (base.css) : c'est la même
                  // valeur que lit <AnchoredBar> pour se poser au-dessus.
                  "flex min-h-[var(--nav-h)] w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  on ? "text-brand" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* -------------------------------------------------------------- AnchoredBar
   Barre fixe posée JUSTE AU-DESSUS de <BottomNav> — le panier d'une caisse,
   le total d'une commande : ce qui doit rester sous les yeux sans masquer la
   navigation.

   ⚠️ À NE PAS CONFONDRE AVEC <ActionBar>, qui se colle à `bottom-0`. Les deux
   ne coexistent pas : ActionBar sert les écrans SANS barre du bas (le desktop
   admin), AnchoredBar ceux qui en ont une.

   ⚠️ Sa position vient de `--nav-h` (base.css), jamais d'un `bottom-16` écrit
   dans une app : la hauteur de la navigation se décide à UN endroit. */
export function AnchoredBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "above-nav fixed inset-x-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-content items-center gap-3">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- ActionBar
   Barre d'action fixe en bas (« Enregistrer »), toujours visible. */
export function ActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/85 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-content items-center gap-2">{children}</div>
    </div>
  );
}
export function SaveButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button size="lg" className="h-11 flex-1 font-semibold" {...props}>
      <Save className="h-4 w-4" /> Enregistrer
    </Button>
  );
}

/* -------------------------------------------------------------- AlertBanner
   Bandeau de notification — TOUJOURS en haut de page. */
type AlertVariant = "success" | "error" | "warning" | "info";
const ALERT: Record<AlertVariant, { cls: string; Icon: LucideIcon }> = {
  success: { cls: "bg-success/15 text-success border-success/30", Icon: CheckCircle2 },
  error: { cls: "bg-destructive/15 text-destructive border-destructive/30", Icon: AlertCircle },
  warning: { cls: "bg-warning/15 text-warning border-warning/30", Icon: AlertTriangle },
  info: { cls: "bg-info/15 text-info border-info/30", Icon: Info },
};
export function AlertBanner({
  variant = "info",
  children,
  onClose,
}: {
  variant?: AlertVariant;
  children: ReactNode;
  onClose?: () => void;
}) {
  const { cls, Icon } = ALERT[variant];
  return (
    <div
      role="status"
      className={cn(
        "safe-top fixed inset-x-0 top-0 z-40 flex items-center gap-2 border-b px-4 py-2.5 text-sm font-medium",
        cls,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1">{children}</span>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Fermer" className="opacity-70">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ InlineNotice
   Le MÊME vocabulaire de variantes qu'<AlertBanner>, mais DANS le flux.

   ⚠️ <AlertBanner> est fixé en haut de l'écran : deux bannières affichées en
   même temps se superposent exactement, et la seconde cache la première. Elle
   convient à un message unique et passager ; un état permanent — « hors ligne »,
   « 3 ventes en attente » — se pose dans la page, à sa place, et cohabite. */
export function InlineNotice({
  variant = "info",
  children,
  className,
}: {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}) {
  const { cls, Icon } = ALERT[variant];
  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium",
        cls,
        className,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}

/* ----------------------------------------------------------- PageHeaderRow
   En-tête de CONTENU (sous l'AppHeader) : titre de page text-2xl + action à droite.
   Réf. Historique devis365 : « Historique » + bouton « Nouveau ». */
export function PageHeaderRow({ title, action }: { title: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <PageTitle>{title}</PageTitle>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ Section
   Bloc de page (surtout Réglages) : titre de section en MAJUSCULES grises,
   description optionnelle, puis contenu. Le contenu encadré utilise <Card>.
   Réf. Réglages call365. NE PAS encadrer la Section entière dans une carte :
   c'est le titre qui est posé sur le fond, le contenu qui porte la carte. */
export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children}
    </section>
  );
}

/* -------------------------------------------------------------- SettingsPage
   Gabarit Réglages IDENTIQUE (réf. call365) : conteneur + titre « Réglages » +
   sections empilées (gap-6). Ordre canonique des blocs COMMUNS :
   Synchronisation (si l'app a la sync) → Apparence → blocs spécifiques app → footer.
   Le titre de page n'a PAS de description (sous-titre) au niveau page. */
export function SettingsPage({ children }: { children: ReactNode }) {
  return (
    <PageContainer className="flex flex-col gap-6">
      <PageTitle>Réglages</PageTitle>
      {children}
    </PageContainer>
  );
}
