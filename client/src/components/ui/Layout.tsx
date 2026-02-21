import * as React from "react";
import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { CalendarDays, LayoutDashboard, CheckSquare, Bell, StickyNote, Sun, Moon, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("es") ? "es" : "en";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" title={t("settings.language")}>
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t("settings.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => i18n.changeLanguage("en")}
          className={cn(currentLang === "en" && "font-bold text-primary")}
        >
          🇺🇸 {t("settings.english")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => i18n.changeLanguage("es")}
          className={cn(currentLang === "es" && "font-bold text-primary")}
        >
          🇪🇸 {t("settings.spanish")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { href: "/", label: t("sidebar.daily"), icon: CheckSquare },
    { href: "/notes", label: t("sidebar.notes"), icon: StickyNote },
    { href: "/monthly", label: t("sidebar.monthly"), icon: CalendarDays },
    { href: "/stats", label: t("sidebar.stats"), icon: LayoutDashboard },
  ];

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Flowly", {
            body: t("sidebar.reminders_active"),
            icon: "/assets/logo.png"
          });
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      {/* Sidebar / Mobile Nav */}
      <aside className="w-full md:w-64 bg-card border-r border-border shrink-0 z-20 sticky top-0 md:h-screen flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <img src="/assets/logo.png" alt="Flowly Logo" className="w-8 h-8 rounded-lg shadow-sm object-cover" />
          <span className="font-display font-bold text-xl tracking-tight">Flowly</span>
        </div>

        <nav className="px-4 py-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-border hidden md:block space-y-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={requestNotificationPermission}
          >
            <Bell className="w-4 h-4" />
            {t("sidebar.reminders")}
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
