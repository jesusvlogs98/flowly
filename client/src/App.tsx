import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/ui/Layout";
import DailyTracker from "@/pages/daily-tracker";
import MonthlyGoals from "@/pages/monthly-goals";
import Stats from "@/pages/stats";
import NotesPage from "@/pages/notes-page";
import AuthPage from "@/pages/auth-page";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { useEffect } from "react";

function Router() {
  const { user, isLoading } = useAuth();
  const { permission, requestPermission } = useNotifications();

  // Prompt for notifications on login if not granted/denied
  useEffect(() => {
    if (user && permission === "default") {
      // Small delay to not annoy immediately
      const timer = setTimeout(() => {
        // Ideally show a UI banner, but auto-requesting for MVP/User Ask
        // requestPermission(); // Better to let user trigger this via UI
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, permission]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={DailyTracker} />
        <Route path="/notes" component={NotesPage} />
        <Route path="/monthly" component={MonthlyGoals} />
        <Route path="/stats" component={Stats} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

import { WelcomeTutorial } from "@/components/WelcomeTutorial";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <WelcomeTutorial />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
