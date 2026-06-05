'use strict';

var clsx = require('clsx');
var tailwindMerge = require('tailwind-merge');
var react = require('react');
var jsxRuntime = require('react/jsx-runtime');
var lucideReact = require('lucide-react');

function cn(...inputs) {
  return tailwindMerge.twMerge(clsx.clsx(inputs));
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
function useLongPress(callback, { delay = 500, moveThreshold = 10 } = {}) {
  const timeoutRef = react.useRef(null);
  const triggeredRef = react.useRef(false);
  const startPosRef = react.useRef(null);
  const cancel = react.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  const start = react.useCallback(
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
  const move = react.useCallback(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("flex flex-col gap-1 p-4 pb-2", className), ...props });
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx("h3", { className: cn("text-base font-semibold", className), ...props });
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("p-4 pt-0", className), ...props });
}
function Input({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx("label", { className: cn("text-sm font-medium", className), ...props });
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx("h1", { className: cn("text-2xl font-bold", className), ...props });
}
function AppHeader({ appName, logoSrc }) {
  return /* @__PURE__ */ jsxRuntime.jsx("header", { className: "safe-top sticky top-0 z-30 h-14 border-b border-border bg-background/85 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mx-auto flex h-14 w-full max-w-content items-center gap-2.5 px-4", children: [
    /* @__PURE__ */ jsxRuntime.jsx("img", { src: logoSrc, alt: "", className: "h-7 w-7 shrink-0 rounded-md" }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-base font-semibold text-foreground", children: appName })
  ] }) });
}
function PageContainer({ children, className }) {
  return /* @__PURE__ */ jsxRuntime.jsx("main", { className: cn("mx-auto w-full max-w-content px-4 pb-24 pt-4", className), children });
}
function BottomNav({
  items,
  active,
  onNavigate
}) {
  return /* @__PURE__ */ jsxRuntime.jsx("nav", { className: "safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntime.jsx("ul", { className: "mx-auto grid w-full max-w-content grid-cols-3", children: items.map(({ key, label, icon: Icon }) => {
    const on = key === active;
    return /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onNavigate(key),
        className: cn(
          "flex min-h-[56px] w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
          on ? "text-brand" : "text-muted-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "h-5 w-5" }),
          label
        ]
      }
    ) }, key);
  }) }) });
}
function ActionBar({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/85 px-4 py-3 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mx-auto flex w-full max-w-content items-center gap-2", children }) });
}
function SaveButton(props) {
  return /* @__PURE__ */ jsxRuntime.jsxs(Button, { size: "lg", className: "h-11 flex-1 font-semibold", ...props, children: [
    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Save, { className: "h-4 w-4" }),
    " Enregistrer"
  ] });
}
var ALERT = {
  success: { cls: "bg-success/15 text-success border-success/30", Icon: lucideReact.CheckCircle2 },
  error: { cls: "bg-destructive/15 text-destructive border-destructive/30", Icon: lucideReact.AlertCircle },
  warning: { cls: "bg-warning/15 text-warning border-warning/30", Icon: lucideReact.AlertTriangle },
  info: { cls: "bg-info/15 text-info border-info/30", Icon: lucideReact.Info }
};
function AlertBanner({
  variant = "info",
  children,
  onClose
}) {
  const { cls, Icon } = ALERT[variant];
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      role: "status",
      className: cn(
        "safe-top fixed inset-x-0 top-0 z-40 flex items-center gap-2 border-b px-4 py-2.5 text-sm font-medium",
        cls
      ),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "min-w-0 flex-1", children }),
        onClose && /* @__PURE__ */ jsxRuntime.jsx("button", { type: "button", onClick: onClose, "aria-label": "Fermer", className: "opacity-70", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-4 w-4" }) })
      ]
    }
  );
}
function PageHeaderRow({ title, action }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-6 flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntime.jsx(PageTitle, { children: title }),
    action
  ] });
}
function Section({
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("section", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground", children: title }),
    description && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground", children: description }),
    children
  ] });
}
function SettingsPage({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(PageContainer, { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntime.jsx(PageTitle, { children: "R\xE9glages" }),
    children
  ] });
}
var THEME_OPTIONS = [
  { value: "system", label: "Syst\xE8me", icon: lucideReact.Monitor },
  { value: "light", label: "Clair", icon: lucideReact.Sun },
  { value: "dark", label: "Sombre", icon: lucideReact.Moon }
];
function ThemeSelector() {
  const [choice, setChoice] = react.useState("system");
  react.useEffect(() => {
    setChoice(getThemeChoice());
    return watchSystemTheme();
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid grid-cols-3 gap-2", children: THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
    const on = choice === value;
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        type: "button",
        onClick: () => {
          setChoice(value);
          setThemeChoice(value);
        },
        className: cn(
          "flex h-12 flex-col items-center justify-center gap-0.5 rounded-md border text-sm font-medium transition active:opacity-70",
          on ? "border-brand bg-brand/10 text-foreground" : "border-border bg-card text-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: cn("h-5 w-5", on ? "text-brand" : "text-muted-foreground") }),
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
  const [pwd, setPwd] = react.useState("");
  const [busy, setBusy] = react.useState(false);
  if (state === "unavailable") {
    return /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CloudOff, { className: "h-4 w-4" }),
      " Synchronisation non disponible."
    ] });
  }
  if (state === "loading") {
    return /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Loader2, { className: "h-4 w-4 animate-spin" }),
      " V\xE9rification\u2026"
    ] });
  }
  if (state === "connected") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "flex items-center gap-2 text-sm text-success", children: [
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CheckCircle2, { className: "h-4 w-4" }),
        " Synchronisation active."
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(Button, { variant: "outline", className: "w-fit", onClick: onDisconnect, children: [
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.LogOut, { className: "h-4 w-4" }),
        " Se d\xE9connecter"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground", children: "Tes donn\xE9es sont en local sur cet appareil. Connecte-toi pour les synchroniser." }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
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
      /* @__PURE__ */ jsxRuntime.jsx(
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
    error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-destructive", children: error })
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
  return /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsx(
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
      children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "min-w-0 flex-1 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-semibold", children: title }),
            badge
          ] }),
          lines && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: lines })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex shrink-0 flex-col items-end justify-between gap-2 self-stretch", children: [
          amount !== void 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "whitespace-nowrap text-right", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-lg font-semibold", children: amount }),
            amountLabel && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xs text-muted-foreground", children: amountLabel })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Menu",
              onClick: (e) => {
                e.stopPropagation();
                onMenu(e.clientX, e.clientY);
              },
              className: "hidden h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground md:flex",
              children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.MoreVertical, { className: "h-5 w-5" })
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
  react.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (isMobile) {
    return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "fixed inset-0 z-40 bg-black/40", onClick: onClose }),
      /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "fixed inset-0 z-40", onClick: onClose }),
    /* @__PURE__ */ jsxRuntime.jsx(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
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

exports.ActionBar = ActionBar;
exports.AlertBanner = AlertBanner;
exports.AppHeader = AppHeader;
exports.Badge = Badge;
exports.BottomNav = BottomNav;
exports.Button = Button;
exports.Card = Card;
exports.CardContent = CardContent;
exports.CardHeader = CardHeader;
exports.CardTitle = CardTitle;
exports.FloatingMenu = FloatingMenu;
exports.FloatingMenuItem = FloatingMenuItem;
exports.HistoryRow = HistoryRow;
exports.Input = Input;
exports.Label = Label;
exports.PageContainer = PageContainer;
exports.PageHeaderRow = PageHeaderRow;
exports.PageTitle = PageTitle;
exports.SaveButton = SaveButton;
exports.Section = Section;
exports.Select = Select;
exports.SettingsPage = SettingsPage;
exports.SyncSection = SyncSection;
exports.THEME_INIT_SCRIPT = THEME_INIT_SCRIPT;
exports.Textarea = Textarea;
exports.ThemeSelector = ThemeSelector;
exports.applyThemeChoice = applyThemeChoice;
exports.cn = cn;
exports.getThemeChoice = getThemeChoice;
exports.resolvesToDark = resolvesToDark;
exports.setThemeChoice = setThemeChoice;
exports.useLongPress = useLongPress;
exports.watchSystemTheme = watchSystemTheme;
