import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, LineChart, Calendar } from "lucide-react";
import logoPng from "/assets/logo.png";

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Hero Section */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="max-w-xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-primary">
              Flow through your goals.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your personal command center for monthly goals, daily habits, and productivity tracking.
              Build consistency one day at a time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-background shadow-sm border border-border flex items-center justify-center text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Monthly Goals</h3>
              <p className="text-sm text-muted-foreground">Set clear intentions and mantras for the month ahead.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-background shadow-sm border border-border flex items-center justify-center text-primary">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Daily Habits</h3>
              <p className="text-sm text-muted-foreground">Track your streaks and daily to-do lists effortlessly.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-background shadow-sm border border-border flex items-center justify-center text-primary">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Visualize your energy levels and consistency over time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="flex-1 p-8 flex items-center justify-center bg-background border-l border-border">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="text-center space-y-4">
            <img src={logoPng} alt="Flowly Logo" className="w-16 h-16 rounded-xl mx-auto shadow-sm object-cover" />
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">Welcome to Flowly</CardTitle>
              <CardDescription>Sign in to your account to continue tracking</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02]" 
              size="lg"
              onClick={() => window.location.href = "/api/login"}
            >
              Log in with Replit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
