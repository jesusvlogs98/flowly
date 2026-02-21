import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { format } from "date-fns";

// GET /api/todos?date=YYYY-MM-DD
export function useTodos(date: Date) {
  const dateStr = format(date, "yyyy-MM-dd");
  
  return useQuery({
    queryKey: [api.todos.list.path, dateStr],
    queryFn: async () => {
      const url = `${api.todos.list.path}?date=${dateStr}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch todos");
      return api.todos.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/todos
export function useCreateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { date: string, text: string }) => {
      const res = await fetch(api.todos.create.path, {
        method: api.todos.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to create todo");
      return api.todos.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.todos.list.path, data.date] });
    },
  });
}

// PATCH /api/todos/:id
export function useUpdateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<{ text: string, completed: boolean }>) => {
      const url = buildUrl(api.todos.update.path, { id });
      const res = await fetch(url, {
        method: api.todos.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update todo");
      return api.todos.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.todos.list.path, data.date] });
    },
  });
}

// DELETE /api/todos/:id
export function useDeleteTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, date }: { id: number, date: string }) => {
      const url = buildUrl(api.todos.delete.path, { id });
      const res = await fetch(url, {
        method: api.todos.delete.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete todo");
      return { id, date }; // Return context for invalidation
    },
    onSuccess: ({ date }) => {
      queryClient.invalidateQueries({ queryKey: [api.todos.list.path, date] });
    },
  });
}

// POST /api/todos/:id/toggle (using update endpoint for now if toggle specific doesn't exist)
export function useToggleTodo() {
  const { mutate: updateTodo } = useUpdateTodo();
  return { updateTodo }; // Wrapper to match component usage or refactor component to use useUpdateTodo directly
}
