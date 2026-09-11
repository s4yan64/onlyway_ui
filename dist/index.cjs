"use client";
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ActionBar: () => ActionBar,
  AlertBanner: () => AlertBanner,
  AppHeader: () => AppHeader,
  Badge: () => Badge,
  BottomNav: () => BottomNav,
  Button: () => Button,
  Card: () => Card,
  CardContent: () => CardContent,
  CardHeader: () => CardHeader,
  CardTitle: () => CardTitle,
  Checkbox: () => Checkbox,
  Dialog: () => Dialog,
  DropdownMenu: () => DropdownMenu,
  DropdownMenuItem: () => DropdownMenuItem,
  DropdownMenuSeparator: () => DropdownMenuSeparator,
  FloatingMenu: () => FloatingMenu,
  FloatingMenuItem: () => FloatingMenuItem,
  HistoryRow: () => HistoryRow,
  Input: () => Input,
  Label: () => Label,
  PageContainer: () => PageContainer,
  PageHeaderRow: () => PageHeaderRow,
  PageTitle: () => PageTitle,
  SaveButton: () => SaveButton,
  Section: () => Section,
  Select: () => Select,
  SettingsPage: () => SettingsPage,
  Switch: () => Switch,
  SyncSection: () => SyncSection,
  THEME_INIT_SCRIPT: () => THEME_INIT_SCRIPT,
  Table: () => Table,
  TableBody: () => TableBody,
  TableCell: () => TableCell,
  TableEmpty: () => TableEmpty,
  TableHead: () => TableHead,
  TableHeader: () => TableHeader,
  TableRow: () => TableRow,
  Tabs: () => Tabs,
  TabsContent: () => TabsContent,
  TabsList: () => TabsList,
  TabsTrigger: () => TabsTrigger,
  Textarea: () => Textarea,
  ThemeSelector: () => ThemeSelector,
  applyThemeChoice: () => applyThemeChoice,
  cn: () => cn,
  getThemeChoice: () => getThemeChoice,
  resolvesToDark: () => resolvesToDark,
  setThemeChoice: () => setThemeChoice,
  useLongPress: () => useLongPress,
  watchSystemTheme: () => watchSystemTheme
});
module.exports = __toCommonJS(index_exports);

// src/lib/cn.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/lib/theme.ts
var STORAGE_KEY = "theme";
function getThemeChoice() {
  if (typeof localStorage === "undefined") return "system";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : "system";
}
function resolvesToDark(choice) {
  return choice === "dark" || choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function applyThemeChoice(choice) {
  document.documentElement.classList.toggle("dark", resolvesToDark(choice));
}
function setThemeChoice(choice) {
  localStorage.setItem(STORAGE_KEY, choice);
  applyThemeChoice(choice);
}
function watchSystemTheme() {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    if (getThemeChoice() === "system") applyThemeChoice("system");
  };
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}
var THEME_INIT_SCRIPT = "(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();";

// src/lib/useLongPress.ts
var import_react = require("react");
function useLongPress(callback, { delay = 500, moveThreshold = 10 } = {}) {
  const timeoutRef = (0, import_react.useRef)(null);
  const triggeredRef = (0, import_react.useRef)(false);
  const startPosRef = (0, import_react.useRef)(null);
  const cancel = (0, import_react.useCallback)(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  const start = (0, import_react.useCallback)(
    (e) => {
      triggeredRef.current = false;
      startPosRef.current = { x: e.clientX, y: e.clientY };
      timeoutRef.current = setTimeout(() => {
        triggeredRef.current = true;
        callback(e);
      }, delay);
    },
    [callback, delay]
  );
  const move = (0, import_react.useCallback)(
    (e) => {
      const s = startPosRef.current;
      if (!s) return;
      if (Math.abs(e.clientX - s.x) > moveThreshold || Math.abs(e.clientY - s.y) > moveThreshold) {
        cancel();
      }
    },
    [cancel, moveThreshold]
  );
  return {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerMove: move,
    onPointerCancel: cancel,
    shouldIgnoreClick: () => triggeredRef.current
  };
}

// src/components/ui.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var BTN_VARIANT = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
  outline: "border border-border bg-card hover:bg-muted",
  ghost: "hover:bg-muted",
  brand: "bg-brand text-brand-foreground hover:opacity-90",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90"
};
var BTN_SIZE = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10"
};
function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      className: cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "active:opacity-90 disabled:pointer-events-none disabled:opacity-50",
        BTN_VARIANT[variant],
        BTN_SIZE[size],
        className
      ),
      ...props
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("flex flex-col gap-1 p-4 pb-2", className), ...props });
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: cn("text-base font-semibold", className), ...props });
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("p-4 pt-0", className), ...props });
}
function Input({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "input",
    {
      className: cn(
        "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground",
        "placeholder:text-muted-foreground transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring/40",
        "aria-[invalid=true]:border-destructive disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "textarea",
    {
      className: cn(
        "min-h-16 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground",
        "placeholder:text-muted-foreground transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring/40",
        "aria-[invalid=true]:border-destructive disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Select({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "select",
    {
      className: cn(
        "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Label({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: cn("text-sm font-medium", className), ...props });
}
var BADGE = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/15 text-destructive"
};
function Badge({
  variant = "default",
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "span",
    {
      className: cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        BADGE[variant],
        className
      ),
      ...props
    }
  );
}
function PageTitle({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: cn("text-2xl font-bold", className), ...props });
}

// src/components/layout.tsx
var import_lucide_react = require("lucide-react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function AppHeader({ appName, logoSrc }) {
  return (
    // `min-h-14` et non `h-14` : en border-box, le padding de zone sûre
    // mangerait la hauteur au lieu de l'ajouter, et le titre passerait sous
    // l'encoche de l'iPhone.
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("header", { className: "safe-top sticky top-0 z-30 min-h-14 border-b border-border bg-background/85 backdrop-blur-md", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "mx-auto flex h-14 w-full max-w-content items-center gap-2.5 px-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { src: logoSrc, alt: "", className: "h-7 w-7 shrink-0 rounded-md" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-base font-semibold text-foreground", children: appName })
    ] }) })
  );
}
function PageContainer({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("main", { className: cn("mx-auto w-full max-w-content px-4 pb-24 pt-4", className), children });
}
function BottomNav({
  items,
  active,
  onNavigate
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("nav", { className: "safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-md", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ul", { className: "mx-auto grid w-full max-w-content grid-cols-3", children: items.map(({ key, label, icon: Icon }) => {
    const on = key === active;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "button",
      {
        type: "button",
        onClick: () => onNavigate(key),
        className: cn(
          "flex min-h-[56px] w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
          on ? "text-brand" : "text-muted-foreground"
        ),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Icon, { className: "h-5 w-5" }),
          label
        ]
      }
    ) }, key);
  }) }) });
}
function ActionBar({ children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/85 px-4 py-3 backdrop-blur-md", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "mx-auto flex w-full max-w-content items-center gap-2", children }) });
}
function SaveButton(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Button, { size: "lg", className: "h-11 flex-1 font-semibold", ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.Save, { className: "h-4 w-4" }),
    " Enregistrer"
  ] });
}
var ALERT = {
  success: { cls: "bg-success/15 text-success border-success/30", Icon: import_lucide_react.CheckCircle2 },
  error: { cls: "bg-destructive/15 text-destructive border-destructive/30", Icon: import_lucide_react.AlertCircle },
  warning: { cls: "bg-warning/15 text-warning border-warning/30", Icon: import_lucide_react.AlertTriangle },
  info: { cls: "bg-info/15 text-info border-info/30", Icon: import_lucide_react.Info }
};
function AlertBanner({
  variant = "info",
  children,
  onClose
}) {
  const { cls, Icon } = ALERT[variant];
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      role: "status",
      className: cn(
        "safe-top fixed inset-x-0 top-0 z-40 flex items-center gap-2 border-b px-4 py-2.5 text-sm font-medium",
        cls
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Icon, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "min-w-0 flex-1", children }),
        onClose && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", onClick: onClose, "aria-label": "Fermer", className: "opacity-70", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.X, { className: "h-4 w-4" }) })
      ]
    }
  );
}
function PageHeaderRow({ title, action }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "mb-6 flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PageTitle, { children: title }),
    action
  ] });
}
function Section({
  title,
  description,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: title }),
    description && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-sm text-muted-foreground", children: description }),
    children
  ] });
}
function SettingsPage({ children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(PageContainer, { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PageTitle, { children: "R\xE9glages" }),
    children
  ] });
}

// src/components/patterns.tsx
var import_react2 = require("react");
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var THEME_OPTIONS = [
  { value: "system", label: "Syst\xE8me", icon: import_lucide_react2.Monitor },
  { value: "light", label: "Clair", icon: import_lucide_react2.Sun },
  { value: "dark", label: "Sombre", icon: import_lucide_react2.Moon }
];
function ThemeSelector() {
  const [choice, setChoice] = (0, import_react2.useState)("system");
  (0, import_react2.useEffect)(() => {
    setChoice(getThemeChoice());
    return watchSystemTheme();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "grid grid-cols-3 gap-2", children: THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
    const on = choice === value;
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "button",
      {
        type: "button",
        onClick: () => {
          setChoice(value);
          setThemeChoice(value);
        },
        className: cn(
          "flex h-12 flex-col items-center justify-center gap-0.5 rounded-md border text-sm font-medium transition active:opacity-70",
          on ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground"
        ),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { className: cn("h-5 w-5", on ? "text-background" : "text-muted-foreground") }),
          label
        ]
      },
      value
    );
  }) });
}
function SyncSection({
  state,
  error,
  onConnect,
  onDisconnect
}) {
  const [pwd, setPwd] = (0, import_react2.useState)("");
  const [busy, setBusy] = (0, import_react2.useState)(false);
  if (state === "unavailable") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react2.CloudOff, { className: "h-4 w-4" }),
      " Synchronisation non disponible."
    ] });
  }
  if (state === "loading") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react2.Loader2, { className: "h-4 w-4 animate-spin" }),
      " V\xE9rification\u2026"
    ] });
  }
  if (state === "connected") {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { className: "flex items-center gap-2 text-sm text-success", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react2.CheckCircle2, { className: "h-4 w-4" }),
        " Synchronisation active."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Button, { variant: "outline", className: "w-fit", onClick: onDisconnect, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react2.LogOut, { className: "h-4 w-4" }),
        " Se d\xE9connecter"
      ] })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "text-sm text-muted-foreground", children: "Tes donn\xE9es sont en local sur cet appareil. Connecte-toi pour les synchroniser." }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Input,
        {
          type: "password",
          autoComplete: "current-password",
          placeholder: "Mot de passe partag\xE9",
          value: pwd,
          onChange: (e) => setPwd(e.target.value),
          "aria-invalid": Boolean(error),
          className: "sm:max-w-xs"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Button,
        {
          disabled: !pwd || busy,
          onClick: async () => {
            setBusy(true);
            try {
              await onConnect?.(pwd);
            } finally {
              setBusy(false);
            }
          },
          children: busy ? "Connexion\u2026" : "Se connecter"
        }
      )
    ] }),
    error && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "text-sm text-destructive", children: error })
  ] });
}
function HistoryRow({
  title,
  badge,
  lines,
  amount,
  amountLabel,
  onOpen,
  onMenu
}) {
  const longPress = useLongPress((e) => onMenu(e.clientX, e.clientY));
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: (e) => {
        if (longPress.shouldIgnoreClick()) {
          e.preventDefault();
          return;
        }
        onOpen();
      },
      onKeyDown: (e) => e.key === "Enter" && onOpen(),
      onContextMenu: (e) => {
        e.preventDefault();
        onMenu(e.clientX, e.clientY);
      },
      onPointerDown: longPress.onPointerDown,
      onPointerUp: longPress.onPointerUp,
      onPointerLeave: longPress.onPointerLeave,
      onPointerMove: longPress.onPointerMove,
      onPointerCancel: longPress.onPointerCancel,
      className: "block cursor-pointer select-none rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring md:select-text",
      style: { WebkitTouchCallout: "none" },
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "min-w-0 flex-1 space-y-1.5", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "font-semibold", children: title }),
            badge
          ] }),
          lines && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "text-sm text-muted-foreground", children: lines })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex shrink-0 flex-col items-end justify-between gap-2 self-stretch", children: [
          amount !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "whitespace-nowrap text-right", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "text-lg font-semibold", children: amount }),
            amountLabel && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "text-xs text-muted-foreground", children: amountLabel })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              type: "button",
              "aria-label": "Menu",
              onClick: (e) => {
                e.stopPropagation();
                onMenu(e.clientX, e.clientY);
              },
              className: "hidden h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground md:flex",
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react2.MoreVertical, { className: "h-5 w-5" })
            }
          )
        ] })
      ] })
    }
  ) });
}
function FloatingMenu({
  x,
  y,
  onClose,
  children
}) {
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  (0, import_react2.useEffect)(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (isMobile) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "fixed inset-0 z-40 bg-black/40", onClick: onClose }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "div",
        {
          role: "menu",
          className: "safe-bottom fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border bg-card py-2 shadow-2xl",
          children
        }
      )
    ] });
  }
  const overflowRight = x + 188 > window.innerWidth;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "fixed inset-0 z-40", onClick: onClose }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        role: "menu",
        style: overflowRight ? { top: y, right: 8 } : { top: y, left: x },
        className: "fixed z-50 min-w-[180px] rounded-md border border-border bg-card py-1 shadow-lg",
        children
      }
    )
  ] });
}
function FloatingMenuItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "button",
    {
      type: "button",
      className: cn(
        "block w-full px-4 py-3 text-left text-base hover:bg-muted md:px-3 md:py-2 md:text-sm",
        className
      ),
      ...props
    }
  );
}

// src/components/controls.tsx
var import_react3 = require("react");
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  className
}) {
  const ref = (0, import_react3.useRef)(null);
  const titreId = (0, import_react3.useId)();
  const descId = (0, import_react3.useId)();
  (0, import_react3.useEffect)(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "dialog",
    {
      ref,
      "aria-labelledby": titreId,
      "aria-describedby": description ? descId : void 0,
      onCancel: (e) => {
        e.preventDefault();
        onClose();
      },
      onClick: (e) => {
        if (e.target === ref.current) onClose();
      },
      className: cn(
        "w-[calc(100%-2rem)] max-w-lg rounded-lg border border-border bg-card p-0",
        "text-card-foreground shadow-lg backdrop:bg-black/50",
        className
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "max-h-[85vh] overflow-y-auto", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "border-b border-border px-5 py-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { id: titreId, className: "text-lg font-semibold", children: title }),
          description ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { id: descId, className: "mt-1 text-sm text-muted-foreground", children: description }) : null
        ] }),
        children ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "px-5 py-4", children }) : null,
        footer ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end", children: footer }) : null
      ] })
    }
  );
}
var TabsCtx = (0, import_react3.createContext)(null);
function useTabs(qui) {
  const ctx = (0, import_react3.useContext)(TabsCtx);
  if (!ctx) throw new Error(`<${qui}> doit \xEAtre rendu dans <Tabs>.`);
  return ctx;
}
function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className
}) {
  const [interne, setInterne] = (0, import_react3.useState)(defaultValue ?? "");
  const nom = (0, import_react3.useId)();
  const controle = value !== void 0;
  const valeur = controle ? value : interne;
  const choisir = (0, import_react3.useCallback)(
    (v) => {
      if (!controle) setInterne(v);
      onValueChange?.(v);
    },
    [controle, onValueChange]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TabsCtx.Provider, { value: { valeur, choisir, nom }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className, children }) });
}
function TabsList({ className, children }) {
  const ref = (0, import_react3.useRef)(null);
  const onKeyDown = (e) => {
    const pas = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (pas === void 0 && e.key !== "Home" && e.key !== "End") return;
    const onglets = Array.from(
      ref.current?.querySelectorAll('[role="tab"]:not(:disabled)') ?? []
    );
    if (onglets.length === 0) return;
    e.preventDefault();
    const actuel = onglets.findIndex((o) => o === document.activeElement);
    const cible = e.key === "Home" ? 0 : e.key === "End" ? onglets.length - 1 : (actuel + (pas ?? 0) + onglets.length) % onglets.length;
    onglets[cible]?.focus();
    onglets[cible]?.click();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "div",
    {
      ref,
      role: "tablist",
      onKeyDown,
      className: cn(
        "inline-flex items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground",
        className
      ),
      children
    }
  );
}
function TabsTrigger({
  value,
  className,
  ...props
}) {
  const { valeur, choisir, nom } = useTabs("TabsTrigger");
  const actif = valeur === value;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "button",
    {
      type: "button",
      role: "tab",
      id: `${nom}-onglet-${value}`,
      "aria-selected": actif,
      "aria-controls": `${nom}-panneau-${value}`,
      tabIndex: actif ? 0 : -1,
      onClick: () => choisir(value),
      className: cn(
        // 44 px de haut : zone tactile confortable sur téléphone.
        "inline-flex h-11 select-none items-center justify-center gap-2 rounded-md px-4",
        "text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        actif ? "bg-card text-foreground shadow-sm" : "hover:text-foreground",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  value,
  className,
  ...props
}) {
  const { valeur, nom } = useTabs("TabsContent");
  if (valeur !== value) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "div",
    {
      role: "tabpanel",
      id: `${nom}-panneau-${value}`,
      "aria-labelledby": `${nom}-onglet-${value}`,
      tabIndex: 0,
      className: cn("mt-4 focus-visible:outline-none", className),
      ...props
    }
  );
}
function Switch({
  checked,
  onCheckedChange,
  disabled,
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": checked,
      disabled,
      onClick: () => onCheckedChange(!checked),
      className: cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "span",
        {
          className: cn(
            "pointer-events-none flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors",
            checked ? "bg-primary" : "bg-muted-foreground/30"
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "span",
            {
              className: cn(
                "block h-5 w-5 rounded-full bg-card shadow-sm transition-transform",
                checked ? "translate-x-5" : "translate-x-0"
              )
            }
          )
        }
      )
    }
  );
}
function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "button",
    {
      type: "button",
      role: "checkbox",
      "aria-checked": checked,
      disabled,
      onClick: () => onCheckedChange(!checked),
      className: cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "span",
        {
          className: cn(
            "pointer-events-none flex h-5 w-5 items-center justify-center rounded border transition-colors",
            checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
          ),
          children: checked ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react3.Check, { className: "h-4 w-4", strokeWidth: 3 }) : null
        }
      )
    }
  );
}
function DropdownMenu({
  trigger,
  children,
  className
}) {
  const [ancre, setAncre] = (0, import_react3.useState)(null);
  const ref = (0, import_react3.useRef)(null);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "span",
      {
        ref,
        className: cn("inline-flex", className),
        onClick: () => {
          const r = ref.current?.getBoundingClientRect();
          if (r) setAncre({ x: r.left, y: r.bottom + 4 });
        },
        children: trigger
      }
    ),
    ancre ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FloatingMenu, { x: ancre.x, y: ancre.y, onClose: () => setAncre(null), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { onClick: () => setAncre(null), children }) }) : null
  ] });
}
var DropdownMenuItem = FloatingMenuItem;
function DropdownMenuSeparator() {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { role: "separator", className: "my-1 h-px bg-border" });
}
function Table({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "w-full overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("table", { className: cn("w-full caption-bottom text-sm", className), ...props }) });
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("thead", { className: cn("[&_tr]:border-b [&_tr]:border-border", className), ...props });
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("tbody", { className: cn("[&_tr:last-child]:border-0", className), ...props });
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "tr",
    {
      className: cn("border-b border-border transition-colors hover:bg-muted/50", className),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "th",
    {
      className: cn(
        "h-11 whitespace-nowrap px-3 text-left align-middle text-xs font-medium uppercase tracking-wide text-muted-foreground",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { className: cn("px-3 py-3 align-middle", className), ...props });
}
function TableEmpty({ colSpan, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { colSpan, className: "px-3 py-10 text-center text-sm text-muted-foreground", children }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionBar,
  AlertBanner,
  AppHeader,
  Badge,
  BottomNav,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  FloatingMenu,
  FloatingMenuItem,
  HistoryRow,
  Input,
  Label,
  PageContainer,
  PageHeaderRow,
  PageTitle,
  SaveButton,
  Section,
  Select,
  SettingsPage,
  Switch,
  SyncSection,
  THEME_INIT_SCRIPT,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeSelector,
  applyThemeChoice,
  cn,
  getThemeChoice,
  resolvesToDark,
  setThemeChoice,
  useLongPress,
  watchSystemTheme
});
