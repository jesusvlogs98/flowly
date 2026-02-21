import { useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useTranslation } from "react-i18next";
import { useHabits, useHabitCompletions } from "@/hooks/use-habits";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Loader2 } from "lucide-react";

export default function Stats() {
  const { t } = useTranslation();
  const [month] = useState(new Date());

  const start = startOfMonth(month);
  const end = endOfMonth(month);

  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: completions, isLoading: completionsLoading } = useHabitCompletions(start, end);

  if (habitsLoading || completionsLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const habitStats = habits?.map(habit => {
    const count = completions?.filter(c => c.habitId === habit.id).length || 0;
    return {
      name: habit.title,
      count: count,
    };
  }) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold">{t("stats.title")}</h1>
        <p className="text-muted-foreground">{t("stats.subtitle")} {format(month, "MMMM yyyy")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2 hover-elevate">
          <CardHeader>
            <CardTitle>{t("stats.habit_consistency")}</CardTitle>
            <CardDescription>{t("stats.habit_consistency_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {habitStats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>{t("stats.no_data")}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitStats}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'transparent' }}
                    formatter={(value) => [`${value} ${t("stats.days")}`, t("stats.completions_label")]}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle>{t("stats.energy_title")}</CardTitle>
            <CardDescription>{t("stats.energy_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
            <p>{t("stats.no_data")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
