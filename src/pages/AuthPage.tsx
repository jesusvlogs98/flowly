import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";

export default function AuthPage() {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const login = useLogin();
  const register = useRegister();
  const isLoading = login.isPending || register.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login.mutateAsync({ email, password });
      } else {
        await register.mutateAsync({ email, name, password });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t("app.name")}</h1>
          <p className="text-muted-foreground">{t("app.tagline")}</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{mode === "login" ? t("auth.login") : t("auth.register")}</CardTitle>
            <CardDescription>
              {mode === "login" ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
              <button
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="text-primary underline font-medium"
              >
                {mode === "login" ? t("auth.signUp") : t("auth.signIn")}
              </button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t("auth.name")}</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t("auth.email")}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t("auth.password")}</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading
                  ? mode === "login" ? t("auth.loggingIn") : t("auth.registering")
                  : mode === "login" ? t("auth.login") : t("auth.register")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Language switcher */}
        <div className="flex justify-center gap-3 text-sm text-muted-foreground">
          <button onClick={() => i18n.changeLanguage("en")} className={i18n.language?.startsWith("en") ? "font-bold text-foreground" : ""}>
            🇺🇸 EN
          </button>
          <span>·</span>
          <button onClick={() => i18n.changeLanguage("es")} className={i18n.language?.startsWith("es") ? "font-bold text-foreground" : ""}>
            🇪🇸 ES
          </button>
        </div>
      </div>
    </div>
  );
}
