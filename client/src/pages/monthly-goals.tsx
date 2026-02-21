import { useState } from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useMonthlyGoal, useUpsertMonthlyGoal } from "@/hooks/use-monthly-goals";
import { useHabits, useCreateHabit } from "@/hooks/use-habits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Target, Quote, List, Loader2 } from "lucide-react";

export default function MonthlyGoals() {
  const { t } = useTranslation();
  const currentMonth = format(new Date(), "yyyy-MM");
  const { data: goal, isLoading } = useMonthlyGoal(new Date());
  const { mutate: upsertGoal } = useUpsertMonthlyGoal();

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
        <h1 className="text-3xl font-display font-bold">{t("monthly.title")}</h1>
        <p className="text-muted-foreground">{t("monthly.subtitle")} {format(new Date(), "MMMM yyyy")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mantra */}
        <Card className="bg-primary/5 border-primary/20 hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Quote className="w-5 h-5" />
              {t("monthly.mantra_title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t("monthly.mantra_placeholder")}
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

        {/* Main Goal */}
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t("monthly.goal_title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t("monthly.goal_placeholder")}
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

        {/* Top 3 */}
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="w-5 h-5" />
              {t("monthly.top3_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <Input
                  placeholder={`${t("monthly.top3_placeholder")} ${i + 1}`}
                  value={goal?.top3?.[i] || ""}
                  onChange={(e) => handleUpdateTop3(i, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Habits Setup */}
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle>{t("monthly.habits_title")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("monthly.habits_desc")}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddHabit} className="flex gap-2">
              <Input
                placeholder={t("monthly.habit_placeholder")}
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </form>
            <div className="space-y-2">
              {habits?.map((habit) => (
                <div key={habit.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm">{habit.title}</span>
                </div>
              ))}
              {habits?.length === 0 && (
                <p className="text-sm text-muted-foreground italic">{t("monthly.active_habits")}: 0</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
