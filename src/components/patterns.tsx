// Patterns canoniques — IDENTIQUES sur toutes les PWA.
// ThemeSelector, SyncSection, HistoryRow (+ FloatingMenu). Tokens uniquement.
import { type ReactNode, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  CloudOff,
  Loader2,
  LogOut,
  Monitor,
  Moon,
  MoreVertical,
  Sun,
} from "lucide-react";
import { cn } from "../lib/cn";
import { useLongPress } from "../lib/useLongPress";
import {
  type ThemeChoice,
  getThemeChoice,
  setThemeChoice,
  watchSystemTheme,
} from "../lib/theme";
import { Badge, Button, Card, Input } from "./ui";

/* ------------------------------------------------------------ ThemeSelector
   Sélecteur Apparence : 3 segments à icônes (Système/Clair/Sombre).
   Actif : border-brand bg-brand/10. */
const THEME_OPTIONS: { value: ThemeChoice; label: string; icon: LucideIcon }[] = [
  { value: "system", label: "Système", icon: Monitor },
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon },
];
export function ThemeSelector() {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  useEffect(() => {
    setChoice(getThemeChoice());
    return watchSystemTheme();
  }, []);
  return (
    <div className="grid grid-cols-3 gap-2">
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
        const on = choice === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => {
              setChoice(value);
              setThemeChoice(value);
            }}
            className={cn(
              "flex h-12 flex-col items-center justify-center gap-0.5 rounded-md border text-sm font-medium transition active:opacity-70",
              on ? "border-brand bg-brand/10 text-foreground" : "border-border bg-card text-foreground",
            )}
          >
            <Icon className={cn("h-5 w-5", on ? "text-brand" : "text-muted-foreground")} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- SyncSection
   Section « Synchronisation » des Réglages (apps à sync par mot de passe partagé).
   États : indisponible / chargement / connecté / déconnecté. Logique fournie en props. */
export function SyncSection({
  state,
  error,
  onConnect,
  onDisconnect,
}: {
  state: "unavailable" | "loading" | "connected" | "disconnected";
  error?: string | null;
  onConnect?: (password: string) => void;
  onDisconnect?: () => void;
}) {
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);

  if (state === "unavailable") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <CloudOff className="h-4 w-4" /> Synchronisation non disponible.
      </p>
    );
  }
  if (state === "loading") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Vérification…
      </p>
    );
  }
  if (state === "connected") {
    return (
      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" /> Synchronisation active.
        </p>
        <Button variant="outline" className="w-fit" onClick={onDisconnect}>
          <LogOut className="h-4 w-4" /> Se déconnecter
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Tes données sont en local sur cet appareil. Connecte-toi pour les synchroniser.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="Mot de passe partagé"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          aria-invalid={Boolean(error)}
          className="sm:max-w-xs"
        />
        <Button
          disabled={!pwd || busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConnect?.(pwd);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Connexion…" : "Se connecter"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

/* --------------------------------------------------------------- HistoryRow
   Ligne d'historique : tap = ouvrir, kebab/clic droit = menu, long-press mobile = menu. */
export function HistoryRow({
  title,
  badge,
  lines,
  amount,
  amountLabel,
  onOpen,
  onMenu,
}: {
  title: ReactNode;
  badge?: ReactNode;
  lines?: ReactNode;
  amount?: ReactNode;
  amountLabel?: string;
  onOpen: () => void;
  onMenu: (x: number, y: number) => void;
}) {
  const longPress = useLongPress((e) => onMenu(e.clientX, e.clientY));
  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          if (longPress.shouldIgnoreClick()) {
            e.preventDefault();
            return;
          }
          onOpen();
        }}
        onKeyDown={(e) => e.key === "Enter" && onOpen()}
        onContextMenu={(e) => {
          e.preventDefault();
          onMenu(e.clientX, e.clientY);
        }}
        onPointerDown={longPress.onPointerDown}
        onPointerUp={longPress.onPointerUp}
        onPointerLeave={longPress.onPointerLeave}
        onPointerMove={longPress.onPointerMove}
        onPointerCancel={longPress.onPointerCancel}
        className="block cursor-pointer select-none rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring md:select-text"
        style={{ WebkitTouchCallout: "none" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold">{title}</span>
              {badge}
            </div>
            {lines && <div className="text-sm text-muted-foreground">{lines}</div>}
          </div>
          <div className="flex shrink-0 flex-col items-end justify-between gap-2 self-stretch">
            {amount !== undefined && (
              <div className="whitespace-nowrap text-right">
                <div className="text-lg font-semibold">{amount}</div>
                {amountLabel && <div className="text-xs text-muted-foreground">{amountLabel}</div>}
              </div>
            )}
            <button
              type="button"
              aria-label="Menu"
              onClick={(e) => {
                e.stopPropagation();
                onMenu(e.clientX, e.clientY);
              }}
              className="hidden h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground md:flex"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
// Badge de statut prêt à l'emploi dans une ligne (réexport pratique).
export { Badge, Card };

/* ------------------------------------------------------------- FloatingMenu
   Menu d'actions : bottom-sheet mobile / popover desktop. (mobile détecté simplement.) */
export function FloatingMenu({
  x,
  y,
  onClose,
  children,
}: {
  x: number;
  y: number;
  onClose: () => void;
  children: ReactNode;
}) {
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
        <div
          role="menu"
          className="safe-bottom fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border bg-card py-2 shadow-2xl"
        >
          {children}
        </div>
      </>
    );
  }
  const overflowRight = x + 188 > window.innerWidth;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        role="menu"
        style={overflowRight ? { top: y, right: 8 } : { top: y, left: x }}
        className="fixed z-50 min-w-[180px] rounded-md border border-border bg-card py-1 shadow-lg"
      >
        {children}
      </div>
    </>
  );
}
export function FloatingMenuItem({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "block w-full px-4 py-3 text-left text-base hover:bg-muted md:px-3 md:py-2 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}
