import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckSquare, CalendarDays, BarChart2, StickyNote,
  Sun, Moon, Globe, LogOut, Zap
} from "lucide-react";
import { useState, useEffect } from "react";

function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved as "light" | "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button
      variant="ghost" size="icon"
      onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
      title={t("settings.theme")}
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}

function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const isEs = i18n.language?.startsWith("es");
  return (
    <Button
      variant="ghost" size="icon"
      onClick={() => i18n.changeLanguage(isEs ? "en" : "es")}
      title={t("settings.language")}
    >
      <Globe className="h-5 w-5" />
    </Button>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { t } = useTranslation();
  const logout = useLogout();

  const nav = [
    { href: "/", icon: CheckSquare, label: t("nav.daily") },
    { href: "/monthly", icon: CalendarDays, label: t("nav.monthly") },
    { href: "/stats", icon: BarChart2, label: t("nav.stats") },
    { href: "/notes", icon: StickyNote, label: t("nav.notes") },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar desktop / bottom bar mobile */}
      <aside className="
        md:w-60 md:min-h-screen md:flex md:flex-col md:border-r md:border-border md:sticky md:top-0 md:h-screen
        fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border
        flex flex-row md:flex-col
      ">
        {/* Logo - solo desktop */}
        <div className="hidden md:flex items-center gap-3 p-5 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl">Flowly</span>
        </div>

        {/* Nav */}
        <nav className="flex md:flex-col flex-1 md:p-3 md:gap-1 justify-around md:justify-start px-2 py-1">
          {nav.map(({ href, icon: Icon, label }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <a className={cn(
                  "flex md:flex-row flex-col items-center md:gap-3 gap-0.5 md:px-3 md:py-2.5 px-3 py-2 rounded-xl transition-all text-xs md:text-sm",
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <Icon className={cn("w-5 h-5 md:w-5 md:h-5 w-6 h-6", active && "stroke-[2.5]")} />
                  <span className="md:inline">{label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Bottom controls - solo desktop */}
        <div className="hidden md:flex flex-col gap-1 p-3 border-t border-border">
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={() => logout.mutate()} title={t("auth.logout")}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
