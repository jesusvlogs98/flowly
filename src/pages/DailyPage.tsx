import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, ChevronLeft, ChevronRight, Battery, BatteryMedium, BatteryLow } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, addDays, subDays } from "date-fns";

export default function DailyPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [date, setDate] = useState(formatDate(new Date()));
  const [newTodo, setNewTodo] = useState("");

  const dateObj = parseISO(date);
  const isToday = date === formatDate(new Date());

  const { data: habits = [] } = useQuery({
    queryKey: ["habits"],
    queryFn: () => apiRequest("GET", "/api/habits"),
  });

  const { data: completions = [] } = useQuery({
    queryKey: ["habit-completions", date],
    queryFn: () => apiRequest("GET", `/api/habit-completions?start=${date}&end=${date}`),
  });

  const { data: dailyLog } = useQuery({
    queryKey: ["daily-log", date],
    queryFn: () => apiRequest("GET", `/api/daily-logs/${date}`),
  });

  const { data: todos = [] } = useQuery({
    queryKey: ["todos", date],
    queryFn: () => apiRequest("GET", `/api/todos/${date}`),
  });

  const toggleHabit = useMutation({
    mutationFn: ({ habitId, completed }: { habitId: number; completed: boolean }) =>
      apiRequest("POST", "/api/habit-completions/toggle", { habitId, date, completed }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habit-completions", date] }),
  });

  const updateLog = useMutation({
    mutationFn: (data: { energyLevel?: number; moodNote?: string }) =>
      apiRequest("POST", "/api/daily-logs", { date, ...dailyLog, ...data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["daily-log", date] }),
  });

  const addTodo = useMutation({
    mutationFn: (text: string) => apiRequest("POST", "/api/todos", { date, text }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["todos", date] }); setNewTodo(""); },
  });

  const toggleTodo = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      apiRequest("PATCH", `/api/todos/${id}`, { completed }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos", date] }),
  });

  const deleteTodo = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/todos/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos", date] }),
  });

  const isCompleted = (habitId: number) => completions.some((c: any) => c.habitId === habitId && c.completed);

  const EnergyIcon = (level: number) => {
    if (level >= 7) return <Battery className="w-5 h-5 text-green-500" />;
    if (level >= 4) return <BatteryMedium className="w-5 h-5 text-yellow-500" />;
    return <BatteryLow className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with date navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("daily.title")}</h1>
          <p className="text-muted-foreground text-sm">{format(dateObj, "EEEE, MMMM d, yyyy")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDate(formatDate(subDays(dateObj, 1)))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {!isToday && (
            <Button variant="outline" size="sm" onClick={() => setDate(formatDate(new Date()))}>
              Today
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setDate(formatDate(addDays(dateObj, 1)))} disabled={isToday}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habits */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              {t("daily.habits")}
              <span className="text-sm font-normal text-muted-foreground">
                {completions.filter((c: any) => c.completed).length} / {habits.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {habits.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">{t("daily.noHabits")}</p>
            ) : habits.map((habit: any) => {
              const done = isCompleted(habit.id);
              return (
                <div
                  key={habit.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    done ? "bg-primary/5 border-primary/30" : "border-border hover:border-primary/30"
                  )}
                  onClick={() => toggleHabit.mutate({ habitId: habit.id, completed: !done })}
                >
                  <Checkbox checked={done} onCheckedChange={() => toggleHabit.mutate({ habitId: habit.id, completed: !done })} />
                  <span className={cn("text-sm font-medium", done && "line-through text-muted-foreground")}>
                    {habit.title}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Energy & Mood */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {t("daily.energy")}
              {EnergyIcon(dailyLog?.energyLevel || 5)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <label className="font-medium">{t("daily.energyLevel")}</label>
                <span className="text-2xl font-bold text-primary">{dailyLog?.energyLevel || 5}</span>
              </div>
              <Slider
                value={[dailyLog?.energyLevel || 5]}
                min={1} max={10} step={1}
                onValueChange={([v]) => updateLog.mutate({ energyLevel: v })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span><span>5</span><span>10</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t("daily.moodNote")}</label>
              <Textarea
                placeholder={t("daily.moodPlaceholder")}
                value={dailyLog?.moodNote || ""}
                onChange={(e) => updateLog.mutate({ moodNote: e.target.value })}
                className="min-h-[100px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* To-Do */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("daily.todos")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <form
              onSubmit={(e) => { e.preventDefault(); if (newTodo.trim()) addTodo.mutate(newTodo); }}
              className="flex gap-2"
            >
              <Input
                placeholder={t("daily.addTodo")}
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <Button type="submit" size="icon"><Plus className="w-4 h-4" /></Button>
            </form>
            <div className="space-y-2">
              {todos.map((todo: any) => (
                <div key={todo.id} className="flex items-center gap-3 group p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(c) => toggleTodo.mutate({ id: todo.id, completed: c as boolean })}
                  />
                  <span className={cn("flex-1 text-sm", todo.completed && "line-through text-muted-foreground")}>
                    {todo.text}
                  </span>
                  <Button
                    variant="ghost" size="icon"
                    className="opacity-0 group-hover:opacity-100 h-7 w-7"
                    onClick={() => deleteTodo.mutate(todo.id)}
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
