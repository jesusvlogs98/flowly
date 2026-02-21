import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { format } from "date-fns";

// GET /api/monthly-goals/:month
export function useMonthlyGoal(date: Date) {
  const monthStr = format(date, "yyyy-MM");
  
  return useQuery({
    queryKey: [api.monthlyGoals.get.path, monthStr],
    queryFn: async () => {
      const url = buildUrl(api.monthlyGoals.get.path, { month: monthStr });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch monthly goal");
      
      return api.monthlyGoals.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/monthly-goals
export function useUpsertMonthlyGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Validate with schema first if needed, or rely on backend
      const res = await fetch(api.monthlyGoals.upsert.path, {
        method: api.monthlyGoals.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to save monthly goal");
      return api.monthlyGoals.upsert.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      const monthStr = data.month;
      queryClient.invalidateQueries({ queryKey: [api.monthlyGoals.get.path, monthStr] });
    },
  });
}
