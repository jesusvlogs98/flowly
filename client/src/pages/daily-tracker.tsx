import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { useHabits, useToggleHabit, useHabitCompletions } from "@/hooks/use-habits";
import { useDailyLog, useUpsertDailyLog } from "@/hooks/use-daily-logs";
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { usePersistentNotes } from "@/hooks/use-persistent-notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, Battery, BatteryMedium, BatteryLow, Loader2, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DailyTracker() {
  const { t } = useTranslation();
  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);
  const selectedDateObj = parseISO(selectedDate);

  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: completions } = useHabitCompletions(selectedDateObj, selectedDateObj);
  const { mutate: toggleHabit } = useToggleHabit();

  const { data: dailyLog, isLoading: logLoading } = useDailyLog(selectedDateObj);
  const { mutate: upsertDailyLog } = useUpsertDailyLog();

  const { data: todos, isLoading: todosLoading } = useTodos(selectedDateObj);
  const { mutate: createTodo } = useCreateTodo();
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: deleteTodo } = useDeleteTodo();

  const { data: persistentNotes, isLoading: noteLoading } = usePersistentNotes();

  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    createTodo({ text: newTodo, date: selectedDate });
    setNewTodo("");
  };

  const getEnergyIcon = (level: number) => {
    if (level >= 8) return <Battery className="w-5 h-5 text-green-500" />;
    if (level >= 4) return <BatteryMedium className="w-5 h-5 text-yellow-500" />;
    return <BatteryLow className="w-5 h-5 text-red-500" />;
  };

  if (habitsLoading || logLoading || todosLoading || noteLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">{t("daily.title")}</h1>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-elevate transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t("daily.habits")}
              <span className="text-sm font-normal text-muted-foreground ml-auto">
                {completions?.length || 0} / {habits?.length || 0}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits?.length === 0 && (
              <p className="text-muted-foreground text-sm italic">
                {t("welcome.step3_desc")}
              </p>
            )}
            {habits?.map((habit) => {
              const isCompleted = completions?.some((c) => c.habitId === habit.id);
              return (
                <div
                  key={habit.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
                    isCompleted 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-card border-border hover:border-primary/50"
                  )}
                  onClick={() => toggleHabit({ id: habit.id, date: selectedDateObj, completed: !isCompleted })}
                >
                  <Checkbox 
                    checked={isCompleted} 
                    onCheckedChange={() => toggleHabit({ id: habit.id, date: selectedDateObj, completed: !isCompleted })}
                  />
                  <span className={cn("font-medium", isCompleted && "line-through text-muted-foreground")}>
                    {habit.title}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t("daily.energy")}
              <div className="ml-auto">{getEnergyIcon(dailyLog?.energyLevel || 5)}</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">{t("daily.energy")}: {dailyLog?.energyLevel || 5}/10</label>
              <Slider
                value={[dailyLog?.energyLevel || 5]}
                min={1}
                max={10}
                step={1}
                onValueChange={([val]) => 
                  upsertDailyLog({ 
                    date: selectedDate, 
                    energyLevel: val, 
                    notes: dailyLog?.notes || "" 
                  })
                }
                className="py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("daily.notes")}</label>
              <Textarea
                placeholder="..."
                value={dailyLog?.notes || ""}
                onChange={(e) => 
                  upsertDailyLog({ 
                    date: selectedDate, 
                    energyLevel: dailyLog?.energyLevel || 5, 
                    notes: e.target.value 
                  })
                }
                className="min-h-[120px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 hover-elevate transition-all duration-300">
          <CardHeader>
            <CardTitle>{t("daily.todos")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <Input
                placeholder="..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </form>

            <div className="space-y-2">
              {todos?.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 group p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={todo.completed || false}
                    onCheckedChange={(checked) => 
                      updateTodo({ id: todo.id, completed: checked as boolean })
                    }
                  />
                  <span className={cn(
                    "flex-1",
                    todo.completed && "line-through text-muted-foreground"
                  )}>
                    {todo.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteTodo({ id: todo.id, date: selectedDate })}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
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