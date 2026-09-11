import { ClassValue } from 'clsx';
import * as react from 'react';
import { HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

declare function cn(...inputs: ClassValue[]): string;

type ThemeChoice = "system" | "light" | "dark";
declare function getThemeChoice(): ThemeChoice;
declare function resolvesToDark(choice: ThemeChoice): boolean;
declare function applyThemeChoice(choice: ThemeChoice): void;
declare function setThemeChoice(choice: ThemeChoice): void;
/** À appeler au démarrage : ré-applique le thème quand l'OS change (mode système). */
declare function watchSystemTheme(): () => void;
/**
 * Script anti-flash : à inliner DANS <head> AVANT le 1er paint
 * (index.html en Vite, ou via <Script strategy="beforeInteractive"> / dangerouslySetInnerHTML en Next).
 */
declare const THEME_INIT_SCRIPT: string;

interface LongPressHandlers {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
    /** À brancher sur onClick : true si le clic doit être ignoré (suit un long press). */
    shouldIgnoreClick: () => boolean;
}
declare function useLongPress(callback: (e: React.PointerEvent) => void, { delay, moveThreshold }?: {
    delay?: number;
    moveThreshold?: number;
}): LongPressHandlers;

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "brand" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";
declare function Button({ variant, size, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
}): react.JSX.Element;
declare function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): react.JSX.Element;
declare function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>): react.JSX.Element;
declare function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>): react.JSX.Element;
declare function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>): react.JSX.Element;
declare function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>): react.JSX.Element;
declare function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>): react.JSX.Element;
declare function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>): react.JSX.Element;
declare function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>): react.JSX.Element;
type BadgeVariant = "default" | "success" | "warning" | "info" | "destructive";
declare function Badge({ variant, className, ...props }: HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant;
}): react.JSX.Element;
declare function PageTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>): react.JSX.Element;

declare function AppHeader({ appName, logoSrc }: {
    appName: string;
    logoSrc: string;
}): react.JSX.Element;
declare function PageContainer({ children, className }: {
    children: ReactNode;
    className?: string;
}): react.JSX.Element;
interface NavItem {
    key: string;
    label: string;
    icon: LucideIcon;
}
declare function BottomNav({ items, active, onNavigate, }: {
    items: NavItem[];
    active: string;
    onNavigate: (key: string) => void;
}): react.JSX.Element;
declare function ActionBar({ children }: {
    children: ReactNode;
}): react.JSX.Element;
declare function SaveButton(props: React.ComponentProps<typeof Button>): react.JSX.Element;
type AlertVariant = "success" | "error" | "warning" | "info";
declare function AlertBanner({ variant, children, onClose, }: {
    variant?: AlertVariant;
    children: ReactNode;
    onClose?: () => void;
}): react.JSX.Element;
declare function PageHeaderRow({ title, action }: {
    title: ReactNode;
    action?: ReactNode;
}): react.JSX.Element;
declare function Section({ title, description, children, }: {
    title: string;
    description?: ReactNode;
    children: ReactNode;
}): react.JSX.Element;
declare function SettingsPage({ children }: {
    children: ReactNode;
}): react.JSX.Element;

declare function ThemeSelector(): react.JSX.Element;
declare function SyncSection({ state, error, onConnect, onDisconnect, }: {
    state: "unavailable" | "loading" | "connected" | "disconnected";
    error?: string | null;
    onConnect?: (password: string) => void;
    onDisconnect?: () => void;
}): react.JSX.Element;
declare function HistoryRow({ title, badge, lines, amount, amountLabel, onOpen, onMenu, }: {
    title: ReactNode;
    badge?: ReactNode;
    lines?: ReactNode;
    amount?: ReactNode;
    amountLabel?: string;
    onOpen: () => void;
    onMenu: (x: number, y: number) => void;
}): react.JSX.Element;

declare function FloatingMenu({ x, y, onClose, children, }: {
    x: number;
    y: number;
    onClose: () => void;
    children: ReactNode;
}): react.JSX.Element;
declare function FloatingMenuItem({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>): react.JSX.Element;

declare function Dialog({ open, onClose, title, description, footer, children, className, }: {
    open: boolean;
    onClose: () => void;
    title: ReactNode;
    description?: ReactNode;
    footer?: ReactNode;
    children?: ReactNode;
    className?: string;
}): react.JSX.Element;
declare function Tabs({ value, defaultValue, onValueChange, children, className, }: {
    value?: string;
    defaultValue?: string;
    onValueChange?: (v: string) => void;
    children: ReactNode;
    className?: string;
}): react.JSX.Element;
declare function TabsList({ className, children }: {
    className?: string;
    children: ReactNode;
}): react.JSX.Element;
declare function TabsTrigger({ value, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string;
}): react.JSX.Element;
declare function TabsContent({ value, className, ...props }: HTMLAttributes<HTMLDivElement> & {
    value: string;
}): react.JSX.Element | null;
declare function Switch({ checked, onCheckedChange, disabled, className, ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> & {
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
}): react.JSX.Element;
declare function Checkbox({ checked, onCheckedChange, disabled, className, ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> & {
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
}): react.JSX.Element;
declare function DropdownMenu({ trigger, children, className, }: {
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
}): react.JSX.Element;
declare const DropdownMenuItem: typeof FloatingMenuItem;
declare function DropdownMenuSeparator(): react.JSX.Element;
declare function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>): react.JSX.Element;
declare function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>): react.JSX.Element;
declare function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>): react.JSX.Element;
declare function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>): react.JSX.Element;
declare function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>): react.JSX.Element;
declare function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>): react.JSX.Element;
/** Ligne « rien à afficher » — un tableau vide sans message ressemble à une panne. */
declare function TableEmpty({ colSpan, children }: {
    colSpan: number;
    children: ReactNode;
}): react.JSX.Element;

export { ActionBar, AlertBanner, AppHeader, Badge, BottomNav, Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Dialog, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, FloatingMenu, FloatingMenuItem, HistoryRow, Input, Label, type NavItem, PageContainer, PageHeaderRow, PageTitle, SaveButton, Section, Select, SettingsPage, Switch, SyncSection, THEME_INIT_SCRIPT, Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, type ThemeChoice, ThemeSelector, applyThemeChoice, cn, getThemeChoice, resolvesToDark, setThemeChoice, useLongPress, watchSystemTheme };
