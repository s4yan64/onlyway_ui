// Primitives UI canoniques — IDENTIQUES sur toutes les PWA.
// Tokens shadcn uniquement, jamais de valeur en dur. deps: lucide-react, clsx, tailwind-merge.
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";

/* ----------------------------------------------------------------- Button */
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "brand" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
  outline: "border border-border bg-card hover:bg-muted",
  ghost: "hover:bg-muted",
  brand: "bg-brand text-brand-foreground hover:opacity-90",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
};
const BTN_SIZE: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "active:opacity-90 disabled:pointer-events-none disabled:opacity-50",
        BTN_VARIANT[variant],
        BTN_SIZE[size],
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------- Card */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-4 pb-2", className)} {...props} />;
}
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold", className)} {...props} />;
}
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
}

/* ------------------------------------------------------------------ Input */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground",
        "placeholder:text-muted-foreground transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring/40",
        "aria-[invalid=true]:border-destructive disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

/* --------------------------------------------------------------- Textarea */
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-16 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground",
        "placeholder:text-muted-foreground transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring/40",
        "aria-[invalid=true]:border-destructive disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

/* ----------------------------------------------------------------- Select */
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ Label */
export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium", className)} {...props} />;
}

/* ------------------------------------------------------------------ Badge */
type BadgeVariant = "default" | "success" | "warning" | "info" | "destructive";
const BADGE: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/15 text-destructive",
};
export function Badge({
  variant = "default",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        BADGE[variant],
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------ PageTitle */
export function PageTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  // Titre de page standard, dans le contenu (jamais dans le header).
  return <h1 className={cn("text-2xl font-bold", className)} {...props} />;
}
