import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import AuthPage from "@/pages/AuthPage";
import DailyPage from "@/pages/DailyPage";
import MonthlyPage from "@/pages/MonthlyPage";
import StatsPage from "@/pages/StatsPage";
import NotesPage from "@/pages/NotesPage";
import { Loader2 } from "lucide-react";

function AppInner() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <Layout>
      <Switch>
        <Route path="/" component={DailyPage} />
        <Route path="/monthly" component={MonthlyPage} />
        <Route path="/stats" component={StatsPage} />
        <Route path="/notes" component={NotesPage} />
        <Route>
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Page not found</p>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
