import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { format } from "date-fns";

// GET /api/habits
export function useHabits() {
  return useQuery({
    queryKey: [api.habits.list.path],
    queryFn: async () => {
      const res = await fetch(api.habits.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch habits");
      return api.habits.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/habits
export function useCreateHabit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string, active?: boolean }) => {
      const res = await fetch(api.habits.create.path, {
        method: api.habits.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to create habit");
      return api.habits.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.habits.list.path] });
    },
  });
}

// POST /api/habits/:id/toggle
export function useToggleHabit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, date, completed }: { id: number, date: Date, completed: boolean }) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const url = buildUrl(api.habits.toggle.path, { id });
      
      const res = await fetch(url, {
        method: api.habits.toggle.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr, completed }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to toggle habit");
      return api.habits.toggle.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      const dateStr = format(variables.date, "yyyy-MM-dd");
      // Invalidate completions to refresh the grid/list
      queryClient.invalidateQueries({ queryKey: [api.habits.completions.path] });
    },
  });
}

// GET /api/habits/completions
export function useHabitCompletions(start?: Date, end?: Date) {
  const startStr = start ? format(start, "yyyy-MM-dd") : undefined;
  const endStr = end ? format(end, "yyyy-MM-dd") : undefined;
  
  // Construct query params string manually or use URLSearchParams if params exist
  const queryKey = [api.habits.completions.path, startStr, endStr].filter(Boolean);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      let url = api.habits.completions.path;
      if (startStr && endStr) {
        url += `?start=${startStr}&end=${endStr}`;
      }
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch completions");
      return api.habits.completions.responses[200].parse(await res.json());
    },
  });
}
