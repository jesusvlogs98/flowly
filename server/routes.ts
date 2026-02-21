import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { isAuthenticated } from "./replit_integrations/auth";

// Bypass auth for now, use a static guest user ID
// export async function registerRoutes(
//   httpServer: Server,
//   app: Express
// ): Promise<Server> {
//   // Setup Auth
//   await setupAuth(app);
//   registerAuthRoutes(app);

//   // Protected middleware for API routes
//   const requireAuth = isAuthenticated;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth (still kept for structure but bypassed)
  // await setupAuth(app); 
  // registerAuthRoutes(app);

  // Mock middleware that injects a guest user
  const requireAuth = (req: any, res: any, next: any) => {
    req.user = { 
      claims: { 
        sub: "guest_user_123", // Static guest ID
        email: "guest@example.com",
        first_name: "Guest",
        last_name: "User"
      } 
    };
    next();
  };

  // Monthly Goals
  app.get(api.monthlyGoals.get.path, requireAuth, async (req: any, res) => {
    const userId = req.user!.claims.sub;
    const goal = await storage.getMonthlyGoal(userId, req.params.month);
    if (!goal) {
      return res.status(404).json({ message: "Monthly goal not found" });
    }
    res.json(goal);
  });

  app.post(api.monthlyGoals.upsert.path, requireAuth, async (req: any, res) => {
    try {
      const userId = req.user!.claims.sub;
      const input = api.monthlyGoals.upsert.input.parse(req.body);
      const goal = await storage.upsertMonthlyGoal({ ...input, userId });
      res.json(goal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Habits
  app.get(api.habits.list.path, requireAuth, async (req: any, res) => {
    const userId = req.user!.claims.sub;
    const habits = await storage.getHabits(userId);
    res.json(habits);
  });

  app.post(api.habits.create.path, requireAuth, async (req: any, res) => {
    try {
      const userId = req.user!.claims.sub;
      const input = api.habits.create.input.parse(req.body);
      const habit = await storage.createHabit({ ...input, userId });
      res.status(201).json(habit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.habits.toggle.path, requireAuth, async (req: any, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { date, completed } = req.body;
      const id = parseInt(req.params.id);
      const result = await storage.toggleHabitCompletion(userId, id, date, completed);
      res.json({ completed: result });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.habits.completions.path, requireAuth, async (req: any, res) => {
    const userId = req.user!.claims.sub;
    const { start, end } = req.query;
    const completions = await storage.getHabitCompletions(userId, start as string, end as string);
    res.json(completions);
  });

  // Daily Logs
  app.get(api.dailyLogs.get.path, requireAuth, async (req: any, res) => {
    const userId = req.user!.claims.sub;
    const log = await storage.getDailyLog(userId, req.params.date);
    if (!log) {
      // Return default/empty log instead of 404 to simplify frontend
      return res.json({ date: req.params.date, energyLevel: 5, notes: "" });
    }
    res.json(log);
  });

  app.post(api.dailyLogs.upsert.path, requireAuth, async (req: any, res) => {
    try {
      const userId = req.user!.claims.sub;
      const input = api.dailyLogs.upsert.input.parse(req.body);
      const log = await storage.upsertDailyLog({ ...input, userId });
      res.json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Todos
  app.get(api.todos.list.path, requireAuth, async (req: any, res) => {
    const userId = req.user!.claims.sub;
    const date = req.query.date as string | undefined;
    const todos = await storage.getTodos(userId, date);
    res.json(todos);
  });

  app.post(api.todos.create.path, requireAuth, async (req: any, res) => {
    try {
      const userId = req.user!.claims.sub;
      const input = api.todos.create.input.parse(req.body);
      const todo = await storage.createTodo({ ...input, userId });
      res.status(201).json(todo);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.todos.update.path, requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.todos.update.input.parse(req.body);
      const todo = await storage.updateTodo(id, input);
      res.json(todo);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.todos.delete.path, requireAuth, async (req: any, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTodo(id);
    res.status(204).end();
  });

  // Persistent Notes
  app.get(api.notes.list.path, requireAuth, async (req: any, res) => {
    const userId = req.user!.claims.sub;
    const notes = await storage.getPersistentNotes(userId);
    res.json(notes);
  });

  app.post(api.notes.create.path, requireAuth, async (req: any, res) => {
    const userId = req.user!.claims.sub;
    const note = await storage.createPersistentNote(userId, req.body);
    res.json(note);
  });

  app.patch(api.notes.update.path, requireAuth, async (req: any, res) => {
    const id = parseInt(req.params.id);
    const note = await storage.updatePersistentNote(id, req.body);
    res.json(note);
  });

  app.delete(api.notes.delete.path, requireAuth, async (req: any, res) => {
    const id = parseInt(req.params.id);
    await storage.deletePersistentNote(id);
    res.status(204).end();
  });

  return httpServer;
}
