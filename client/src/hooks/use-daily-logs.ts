import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { format } from "date-fns";

// GET /api/daily-logs/:date
export function useDailyLog(date: Date) {
  const dateStr = format(date, "yyyy-MM-dd");
  
  return useQuery({
    queryKey: [api.dailyLogs.get.path, dateStr],
    queryFn: async () => {
      const url = buildUrl(api.dailyLogs.get.path, { date: dateStr });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch daily log");
      
      return api.dailyLogs.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/daily-logs
export function useUpsertDailyLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { date: string, energyLevel?: number, notes?: string }) => {
      const res = await fetch(api.dailyLogs.upsert.path, {
        method: api.dailyLogs.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to save daily log");
      return api.dailyLogs.upsert.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.dailyLogs.get.path, data.date] });
    },
  });
}
