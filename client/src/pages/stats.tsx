import { useState } from "react";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { useHabits, useHabitCompletions } from "@/hooks/use-habits";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Loader2 } from "lucide-react";

export default function Stats() {
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

  // Process data for charts
  const habitStats = habits?.map(habit => {
    const count = completions?.filter(c => c.habitId === habit.id).length || 0;
    return {
      name: habit.title,
      count: count,
      total: parseInt(format(new Date(), "d")) // Approximate days so far
    };
  }) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold">Progress & Insights</h1>
        <p className="text-muted-foreground">Review your consistency for {format(month, "MMMM yyyy")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2 hover-elevate">
          <CardHeader>
            <CardTitle>Habit Consistency</CardTitle>
            <CardDescription>Number of days completed this month</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Energy levels would go here if we fetched them for the month */}
        <Card className="hover-elevate">
          <CardHeader>
             <CardTitle>Energy Trends</CardTitle>
             <CardDescription>Coming soon...</CardDescription>
          </CardHeader>
           <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
             <p>Data visualization coming in next update</p>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
