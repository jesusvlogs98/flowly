import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useMonthlyGoal, useUpsertMonthlyGoal } from "@/hooks/use-monthly-goals";
import { useHabits, useCreateHabit } from "@/hooks/use-habits";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Target, Quote, List, Loader2 } from "lucide-react";

export default function MonthlyGoals() {
  const currentMonth = format(new Date(), "yyyy-MM");
  const { data: goal, isLoading } = useMonthlyGoal(new Date());
  const { mutate: upsertGoal } = useUpsertMonthlyGoal();
  
  // Habits don't need a date filter for the list, so just fetch all active
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { mutate: createHabit } = useCreateHabit();

  const [newHabit, setNewHabit] = useState("");

  if (isLoading || habitsLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleUpdateTop3 = (index: number, value: string) => {
    const newTop3 = [...(goal?.top3 || ["", "", ""])];
    newTop3[index] = value;
    upsertGoal({
      month: currentMonth,
      mantra: goal?.mantra || "",
      mainGoal: goal?.mainGoal || "",
      top3: newTop3,
    });
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    createHabit({ title: newHabit, active: true });
    setNewHabit("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold">Monthly Plan</h1>
        <p className="text-muted-foreground">Focus and intentions for {format(new Date(), "MMMM yyyy")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mantra Section */}
        <Card className="bg-primary/5 border-primary/20 hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Quote className="w-5 h-5" />
              Mantra of the Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., I am disciplined and focused..."
              className="text-lg font-medium text-center italic border-primary/20 bg-background/50 min-h-[100px] resize-none"
              value={goal?.mantra || ""}
              onChange={(e) => 
                upsertGoal({
                  month: currentMonth,
                  mantra: e.target.value,
                  mainGoal: goal?.mainGoal || "",
                  top3: goal?.top3 || [],
                })
              }
            />
          </CardContent>
        </Card>

        {/* Main Goal Section */}
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              Main Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What is the ONE thing you must achieve?"
              className="min-h-[100px] resize-none"
              value={goal?.mainGoal || ""}
              onChange={(e) => 
                upsertGoal({
                  month: currentMonth,
                  mantra: goal?.mantra || "",
                  mainGoal: e.target.value,
                  top3: goal?.top3 || [],
                })
              }
            />
          </CardContent>
        </Card>

        {/* Top 3 Priorities */}
        <Card className="md:col-span-2 hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="w-5 h-5" />
              Top 3 Priorities
            </CardTitle>
            <CardDescription>The three pillars of your success this month</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Priority {i + 1}</span>
                <Input
                  placeholder={`Priority #${i + 1}`}
                  value={goal?.top3?.[i] || ""}
                  onChange={(e) => handleUpdateTop3(i, e.target.value)}
                  className="bg-muted/30"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Habits Management */}
        <Card className="md:col-span-2 hover-elevate">
          <CardHeader>
            <CardTitle>Active Habits</CardTitle>
            <CardDescription>These will appear in your daily tracker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddHabit} className="flex gap-2">
              <Input
                placeholder="Add a new habit to track..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
              />
              <Button type="submit">Add Habit</Button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {habits?.map((habit) => (
                <div key={habit.id} className="p-3 bg-muted rounded-lg border flex items-center justify-between">
                  <span className="font-medium">{habit.title}</span>
                  {/* Could add delete/archive functionality here later */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
