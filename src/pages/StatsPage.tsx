import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatMonth } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Loader2 } from "lucide-react";

export default function StatsPage() {
  const { t } = useTranslation();
  const now = new Date();
  const month = formatMonth(now);
  const start = format(startOfMonth(now), "yyyy-MM-dd");
  const end = format(endOfMonth(now), "yyyy-MM-dd");

  const { data: habits = [], isLoading: h } = useQuery({
    queryKey: ["habits"],
    queryFn: () => apiRequest("GET", "/api/habits"),
  });

  const { data: completions = [], isLoading: c } = useQuery({
    queryKey: ["habit-completions-range", start, end],
    queryFn: () => apiRequest("GET", `/api/habit-completions?start=${start}&end=${end}`),
  });

  const { data: dailyLogs = [], isLoading: d } = useQuery({
    queryKey: ["daily-logs-range", start, end],
    queryFn: () => apiRequest("GET", `/api/daily-logs?start=${start}&end=${end}`),
  });

  if (h || c || d) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  const habitStats = habits.map((habit: any) => ({
    name: habit.title.length > 12 ? habit.title.slice(0, 12) + "…" : habit.title,
    count: completions.filter((c: any) => c.habitId === habit.id && c.completed).length,
  }));

  const days = eachDayOfInterval({ start: startOfMonth(now), end: now });
  const energyData = days.map(day => {
    const dateStr = format(day, "yyyy-MM-dd");
    const log = (dailyLogs as any[]).find((l: any) => l.date === dateStr);
    return {
      day: format(day, "d"),
      energy: log?.energyLevel || null,
    };
  }).filter(d => d.energy !== null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("stats.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("stats.subtitle")} {format(now, "MMMM yyyy")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t("stats.habitConsistency")}</CardTitle>
            <CardDescription>{t("stats.habitDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {habitStats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                {t("stats.noData")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitStats} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v) => [`${v} ${t("stats.days")}`, ""]}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t("stats.energyTrend")}</CardTitle>
            <CardDescription>{t("stats.energyDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {energyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                {t("stats.noData")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis domain={[1, 10]} ticks={[2, 4, 6, 8, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Line
                    type="monotone" dataKey="energy"
                    stroke="hsl(var(--primary))" strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
