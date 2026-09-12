"use client";

// Contrôles interactifs canoniques — IDENTIQUES sur toutes les PWA.
// Dialog, Tabs, Switch, Checkbox, DropdownMenu, Table. Tokens shadcn uniquement.
//
// AUCUNE bibliothèque de primitives (Radix, Base UI) n'est tirée ici, et c'est
// délibéré : seuls le dialogue et le menu la justifiaient. L'élément natif
// <dialog> fournit déjà le piège à focus, la touche Échap, le calque supérieur
// et l'inertie de l'arrière-plan ; le menu réutilise `FloatingMenu`, qui existe
// déjà dans ce paquet. Le reste est du balisage. Une PWA qui doit démarrer en
// mode avion sur un téléphone ne paie pas 40 Ko pour ça.
import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";
import { FloatingMenu, FloatingMenuItem } from "./patterns";

/* ----------------------------------------------------------------- Dialog
   Bâti sur <dialog> natif : `showModal()` apporte le piège à focus, la touche
   Échap, le calque supérieur et l'inertie de l'arrière-plan — gratuitement, et
   mieux qu'une réimplémentation.

   ⚠️ L'état React reste la source de vérité : la fermeture native (Échap) est
   interceptée et renvoyée par `onClose`, jamais appliquée dans le dos. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titreId = useId();
  const descId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titreId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        // Échap : on refuse la fermeture native pour laisser React décider.
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Un clic qui atteint <dialog> lui-même est un clic sur l'arrière-plan :
        // le contenu vit dans un enfant, il ne remonte donc jamais jusqu'ici.
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        // ⚠️ `m-auto` est INDISPENSABLE et non décoratif : un <dialog> modal se
        // centre grâce au `margin: auto` de la feuille de style du navigateur,
        // que le preflight de Tailwind v4 écrase en `margin: 0` sur TOUS les
        // éléments. Sans lui, le dialogue s'ancre en haut à gauche de l'écran.
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg border border-border bg-card p-0",
        "text-card-foreground shadow-lg backdrop:bg-black/50",
        className,
      )}
    >
      <div className="max-h-[85vh] overflow-y-auto">
        <div className="border-b border-border px-5 py-4">
          <h2 id={titreId} className="text-lg font-semibold">
            {title}
          </h2>
          {description ? (
            <p id={descId} className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {children ? <div className="px-5 py-4">{children}</div> : null}
        {footer ? (
          <div className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------- ReasonPicker
   UNE SOURCE DE MOTIFS, DEUX RENDUS.

   `tiles` — pour le pouce ganté : une grille de tuiles d'au moins 56 px, et
   « Autre… » comme SEULE tuile qui ouvre un clavier. Sur un stand, en décembre,
   retirer un gant pour taper un motif coûte trente secondes et un client.

   `text` — pour le clavier de l'admin : un champ libre, les suggestions en
   liste déroulante native (`<datalist>`).

   ⚠️ CONTRÔLÉ. Le composant ne CONFIRME rien : il rend un motif. C'est à
   l'écran de décider ce qui engage — et pour une annulation irréversible, un
   bouton final qui REDIT le motif vaut mieux qu'une tuile qui engage au premier
   effleurement. Toucher la mauvaise tuile ne doit rien écrire.

   `name` : présent, un champ caché (ou le champ lui-même) porte la valeur dans
   un <form>, pour les Server Actions. */
export function ReasonPicker({
  suggestions,
  value,
  onChange,
  variant = "tiles",
  name,
  otherLabel = "Autre…",
  placeholder = "Motif",
  maxLength,
}: {
  suggestions: readonly string[];
  value: string;
  onChange: (reason: string) => void;
  variant?: "tiles" | "text";
  name?: string;
  otherLabel?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  const listeId = useId();
  // « Autre » est ouvert si l'utilisateur l'a demandé, ou si la valeur ne
  // correspond à aucune tuile (un motif repris, ou tapé puis resélectionné).
  const [autreDemande, setAutreDemande] = useState(false);
  const autre = autreDemande || (value !== "" && !suggestions.includes(value));

  const champ = (
    <input
      name={variant === "text" ? name : undefined}
      list={variant === "text" && suggestions.length > 0 ? listeId : undefined}
      value={value}
      maxLength={maxLength}
      placeholder={placeholder}
      autoFocus={variant === "tiles"}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-md border border-input bg-card px-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
    />
  );

  if (variant === "text") {
    return (
      <>
        {champ}
        {suggestions.length > 0 && (
          <datalist id={listeId}>
            {suggestions.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        )}
      </>
    );
  }

  const tuile = (actif: boolean) =>
    cn(
      "min-h-14 rounded-lg border px-3 text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      actif
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-foreground active:bg-muted",
    );

  return (
    <div className="space-y-2">
      {name && <input type="hidden" name={name} value={value} />}
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={!autre && value === m}
            onClick={() => {
              setAutreDemande(false);
              onChange(m);
            }}
            className={tuile(!autre && value === m)}
          >
            {m}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={autre}
          onClick={() => {
            setAutreDemande(true);
            // Repartir d'un champ vide : garder la tuile précédente comme texte
            // ferait croire qu'on la modifie.
            if (suggestions.includes(value)) onChange("");
          }}
          className={tuile(autre)}
        >
          {otherLabel}
        </button>
      </div>
      {autre && champ}
    </div>
  );
}

/* ------------------------------------------------------------------- Tabs
   Composants composés, vocabulaire shadcn/Radix — un nom que la communauté
   emploie déjà est un nom qu'on n'a pas à expliquer.
   Contrôlé si `value` est fourni, autonome sinon. */
type TabsContexte = { valeur: string; choisir: (v: string) => void; nom: string };
const TabsCtx = createContext<TabsContexte | null>(null);

function useTabs(qui: string) {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error(`<${qui}> doit être rendu dans <Tabs>.`);
  return ctx;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  const [interne, setInterne] = useState(defaultValue ?? "");
  const nom = useId();
  const controle = value !== undefined;
  const valeur = controle ? value : interne;

  const choisir = useCallback(
    (v: string) => {
      if (!controle) setInterne(v);
      onValueChange?.(v);
    },
    [controle, onValueChange],
  );

  return (
    <TabsCtx.Provider value={{ valeur, choisir, nom }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  // Flèches, Origine et Fin : ce que les ARIA Authoring Practices attendent
  // d'un `tablist`. On interroge le DOM plutôt que de tenir un registre de refs
  // — ajouter un onglet ne demande alors rien de plus qu'un <TabsTrigger>.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const pas: number | undefined = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (pas === undefined && e.key !== "Home" && e.key !== "End") return;
    const onglets = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [],
    );
    if (onglets.length === 0) return;
    e.preventDefault();
    const actuel = onglets.findIndex((o) => o === document.activeElement);
    const cible =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? onglets.length - 1
          : (actuel + (pas ?? 0) + onglets.length) % onglets.length;
    onglets[cible]?.focus();
    onglets[cible]?.click();
  };

  return (
    <div
      ref={ref}
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { valeur, choisir, nom } = useTabs("TabsTrigger");
  const actif = valeur === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${nom}-onglet-${value}`}
      aria-selected={actif}
      aria-controls={`${nom}-panneau-${value}`}
      tabIndex={actif ? 0 : -1}
      onClick={() => choisir(value)}
      className={cn(
        // 44 px de haut : zone tactile confortable sur téléphone.
        "inline-flex h-11 select-none items-center justify-center gap-2 rounded-md px-4",
        "text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        actif ? "bg-card text-foreground shadow-sm" : "hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  value,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { valeur, nom } = useTabs("TabsContent");
  if (valeur !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${nom}-panneau-${value}`}
      aria-labelledby={`${nom}-onglet-${value}`}
      tabIndex={0}
      className={cn("mt-4 focus-visible:outline-none", className)}
      {...props}
    />
  );
}

/* ----------------------------------------------------------------- Switch
   `role="switch"` : le rôle ARIA de l'interrupteur. Le bouton fait 44 px de
   haut et de large pour la zone tactile ; la glissière visible vit dedans. */
export function Switch({
  checked,
  onCheckedChange,
  disabled,
  className,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> & {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-primary" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "block h-5 w-5 rounded-full bg-card shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}

/* --------------------------------------------------------------- Checkbox */
export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  className,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> & {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none flex h-5 w-5 items-center justify-center rounded border transition-colors",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
        )}
      >
        {checked ? <Check className="h-4 w-4" strokeWidth={3} /> : null}
      </span>
    </button>
  );
}

/* ----------------------------------------------------------- DropdownMenu
   Enveloppe ergonomique de `FloatingMenu` : elle tient l'état ouvert/fermé et
   calcule l'ancrage depuis le déclencheur, au lieu de laisser chaque écran le
   refaire. Bottom-sheet sur téléphone, popover sur ordinateur — c'est
   `FloatingMenu` qui tranche, à un seul endroit. */
export function DropdownMenu({
  trigger,
  children,
  className,
}: {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [ancre, setAncre] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <>
      <span
        ref={ref}
        className={cn("inline-flex", className)}
        onClick={() => {
          const r = ref.current?.getBoundingClientRect();
          if (r) setAncre({ x: r.left, y: r.bottom + 4 });
        }}
      >
        {trigger}
      </span>
      {ancre ? (
        <FloatingMenu x={ancre.x} y={ancre.y} onClose={() => setAncre(null)}>
          {/* Un clic sur n'importe quelle entrée referme : aucune entrée n'a
              donc à penser à le faire, et aucune ne peut l'oublier. */}
          <div onClick={() => setAncre(null)}>{children}</div>
        </FloatingMenu>
      ) : null}
    </>
  );
}

export const DropdownMenuItem = FloatingMenuItem;

export function DropdownMenuSeparator() {
  return <div role="separator" className="my-1 h-px bg-border" />;
}

/* ------------------------------------------------------------------ Table
   Balisage pur. Le conteneur défile HORIZONTALEMENT : un historique à huit
   colonnes ne rentre pas sur 375 px, et c'est le tableau qui doit défiler,
   jamais la page. */
export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b [&_tr]:border-border", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("border-b border-border transition-colors hover:bg-muted/50", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-11 whitespace-nowrap px-3 text-left align-middle text-xs font-medium uppercase tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-3 py-3 align-middle", className)} {...props} />;
}

/** Ligne « rien à afficher » — un tableau vide sans message ressemble à une panne. */
export function TableEmpty({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-10 text-center text-sm text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}
