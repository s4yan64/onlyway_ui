// Logique de thème système / clair / sombre — IDENTIQUE sur toutes les PWA.
// Persistance localStorage["theme"], classe `.dark` sur <html>, suivi de l'OS.

export type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "theme";

export function getThemeChoice(): ThemeChoice {
  if (typeof localStorage === "undefined") return "system";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : "system";
}

export function resolvesToDark(choice: ThemeChoice): boolean {
  return (
    choice === "dark" ||
    (choice === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

export function applyThemeChoice(choice: ThemeChoice): void {
  document.documentElement.classList.toggle("dark", resolvesToDark(choice));
}

export function setThemeChoice(choice: ThemeChoice): void {
  localStorage.setItem(STORAGE_KEY, choice);
  applyThemeChoice(choice);
}

/** À appeler au démarrage : ré-applique le thème quand l'OS change (mode système). */
export function watchSystemTheme(): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    if (getThemeChoice() === "system") applyThemeChoice("system");
  };
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

/**
 * Script anti-flash : à inliner DANS <head> AVANT le 1er paint
 * (index.html en Vite, ou via <Script strategy="beforeInteractive"> / dangerouslySetInnerHTML en Next).
 */
export const THEME_INIT_SCRIPT =
  "(function(){try{var t=localStorage.getItem('theme')||'system';" +
  "var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);" +
  "document.documentElement.classList.toggle('dark',d);}catch(e){}})();";
