import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatMonth } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Quote, Target, List, Flame } from "lucide-react";
import { format } from "date-fns";

export default function MonthlyPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const month = formatMonth(new Date());
  const [newHabit, setNewHabit] = useState("");

  const { data: goal } = useQuery({
    queryKey: ["monthly-goal", month],
    queryFn: () => apiRequest("GET", `/api/monthly-goals/${month}`).catch(() => null),
  });

  const { data: habits = [] } = useQuery({
    queryKey: ["habits"],
    queryFn: () => apiRequest("GET", "/api/habits"),
  });

  const upsertGoal = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/monthly-goals", { month, ...goal, ...data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["monthly-goal", month] }),
  });

  const addHabit = useMutation({
    mutationFn: (title: string) => apiRequest("POST", "/api/habits", { title }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["habits"] }); setNewHabit(""); },
  });

  const deleteHabit = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/habits/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });

  const updateTop3 = (i: number, value: string) => {
    const top3 = [...(goal?.top3 || ["", "", ""])];
    top3[i] = value;
    upsertGoal.mutate({ top3 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("monthly.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("monthly.subtitle")} {format(new Date(), "MMMM yyyy")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mantra */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-primary">
              <Quote className="w-4 h-4" />
              {t("monthly.mantra")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t("monthly.mantraPlaceholder")}
              value={goal?.mantra || ""}
              onChange={(e) => upsertGoal.mutate({ mantra: e.target.value })}
              className="min-h-[100px] resize-none text-center italic text-lg bg-transparent border-primary/20"
            />
          </CardContent>
        </Card>

        {/* Main Goal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4" />
              {t("monthly.mainGoal")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t("monthly.mainGoalPlaceholder")}
              value={goal?.mainGoal || ""}
              onChange={(e) => upsertGoal.mutate({ mainGoal: e.target.value })}
              className="min-h-[100px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Top 3 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <List className="w-4 h-4" />
              {t("monthly.top3")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <Input
                  placeholder={`${t("monthly.priority")} ${i + 1}`}
                  value={goal?.top3?.[i] || ""}
                  onChange={(e) => updateTop3(i, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Habits */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="w-4 h-4" />
              {t("monthly.habits")}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{t("monthly.habitsDesc")}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <form
              onSubmit={(e) => { e.preventDefault(); if (newHabit.trim()) addHabit.mutate(newHabit); }}
              className="flex gap-2"
            >
              <Input
                placeholder={t("monthly.newHabit")}
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
              />
              <Button type="submit" size="sm">{t("monthly.addHabit")}</Button>
            </form>
            <div className="space-y-2">
              {habits.length === 0 && (
                <p className="text-sm text-muted-foreground italic">{t("monthly.noHabits")}</p>
              )}
              {habits.map((habit: any) => (
                <div key={habit.id} className="flex items-center gap-2 group p-2 rounded-md hover:bg-muted/50">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="flex-1 text-sm">{habit.title}</span>
                  <Button
                    variant="ghost" size="icon"
                    className="opacity-0 group-hover:opacity-100 h-7 w-7"
                    onClick={() => deleteHabit.mutate(habit.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
