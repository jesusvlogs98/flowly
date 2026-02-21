import { z } from "zod";
import { insertMonthlyGoalSchema, insertHabitSchema, insertDailyLogSchema, insertTodoSchema, monthlyGoals, habits, dailyLogs, todos, habitCompletions } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  monthlyGoals: {
    get: {
      method: "GET" as const,
      path: "/api/monthly-goals/:month", // :month is "YYYY-MM"
      responses: {
        200: z.custom<typeof monthlyGoals.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    upsert: {
      method: "POST" as const,
      path: "/api/monthly-goals",
      input: insertMonthlyGoalSchema.omit({ id: true, userId: true }),
      responses: {
        200: z.custom<typeof monthlyGoals.$inferSelect>(),
      },
    },
  },
  habits: {
    list: {
      method: "GET" as const,
      path: "/api/habits",
      responses: {
        200: z.array(z.custom<typeof habits.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/habits",
      input: insertHabitSchema.omit({ id: true, userId: true }),
      responses: {
        201: z.custom<typeof habits.$inferSelect>(),
      },
    },
    toggle: {
      method: "POST" as const,
      path: "/api/habits/:id/toggle",
      input: z.object({ date: z.string(), completed: z.boolean() }),
      responses: {
        200: z.custom<{ completed: boolean }>(),
      },
    },
    completions: {
      method: "GET" as const,
      path: "/api/habits/completions",
      input: z.object({ start: z.string(), end: z.string() }).optional(),
      responses: {
        200: z.array(z.custom<typeof habitCompletions.$inferSelect>()),
      },
    },
  },
  dailyLogs: {
    get: {
      method: "GET" as const,
      path: "/api/daily-logs/:date",
      responses: {
        200: z.custom<typeof dailyLogs.$inferSelect>(),
      },
    },
    upsert: {
      method: "POST" as const,
      path: "/api/daily-logs",
      input: insertDailyLogSchema.omit({ id: true, userId: true }),
      responses: {
        200: z.custom<typeof dailyLogs.$inferSelect>(),
      },
    },
  },
  todos: {
    list: {
      method: "GET" as const,
      path: "/api/todos",
      input: z.object({ date: z.string() }).optional(),
      responses: {
        200: z.array(z.custom<typeof todos.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/todos",
      input: insertTodoSchema.omit({ id: true, userId: true }),
      responses: {
        201: z.custom<typeof todos.$inferSelect>(),
      },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/todos/:id",
      input: insertTodoSchema.partial(),
      responses: {
        200: z.custom<typeof todos.$inferSelect>(),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/todos/:id",
      responses: {
        204: z.void(),
      },
    },
  },
  notes: {
    list: {
      method: "GET" as const,
      path: "/api/notes",
      responses: {
        200: z.array(z.custom<typeof persistentNotes.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/notes",
      input: z.object({ title: z.string().optional(), content: z.string() }),
      responses: {
        200: z.custom<typeof persistentNotes.$inferSelect>(),
      },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/notes/:id",
      input: z.object({ title: z.string().optional(), content: z.string().optional() }),
      responses: {
        200: z.custom<typeof persistentNotes.$inferSelect>(),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/notes/:id",
      responses: {
        204: z.void(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
