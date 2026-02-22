import type { Express } from "express";
import { db } from "./db.js";
import { requireAuth, register, login, logout, getMe } from "./auth.js";
import {
  monthlyGoals, habits, habitCompletions, dailyLogs, todos, permanentNotes
} from "../shared/schema.js";
import { eq, and, between } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Auth
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", getMe);

  // Monthly Goals
  app.get("/api/monthly-goals/:month", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const [goal] = await db.select().from(monthlyGoals)
      .where(and(eq(monthlyGoals.userId, userId), eq(monthlyGoals.month, req.params.month)));
    res.json(goal || null);
  });

  app.post("/api/monthly-goals", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { month, mantra, mainGoal, top3 } = req.body;
    const [existing] = await db.select().from(monthlyGoals)
      .where(and(eq(monthlyGoals.userId, userId), eq(monthlyGoals.month, month)));
    if (existing) {
      const [updated] = await db.update(monthlyGoals)
        .set({ mantra, mainGoal, top3 })
        .where(eq(monthlyGoals.id, existing.id))
        .returning();
      return res.json(updated);
    }
    const [created] = await db.insert(monthlyGoals).values({ userId, month, mantra, mainGoal, top3 }).returning();
    res.json(created);
  });

  // Habits
  app.get("/api/habits", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const result = await db.select().from(habits)
      .where(and(eq(habits.userId, userId), eq(habits.active, true)));
    res.json(result);
  });

  app.post("/api/habits", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const [habit] = await db.insert(habits).values({ userId, title: req.body.title }).returning();
    res.json(habit);
  });

  app.delete("/api/habits/:id", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    await db.update(habits).set({ active: false })
      .where(and(eq(habits.id, parseInt(req.params.id)), eq(habits.userId, userId)));
    res.json({ ok: true });
  });

  // Habit completions
  app.get("/api/habit-completions", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { start, end } = req.query;
    let query = db.select().from(habitCompletions).where(eq(habitCompletions.userId, userId));
    if (start && end) {
      query = db.select().from(habitCompletions)
        .where(and(eq(habitCompletions.userId, userId), between(habitCompletions.date, start as string, end as string)));
    }
    res.json(await query);
  });

  app.post("/api/habit-completions/toggle", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { habitId, date, completed } = req.body;
    const [existing] = await db.select().from(habitCompletions)
      .where(and(eq(habitCompletions.userId, userId), eq(habitCompletions.habitId, habitId), eq(habitCompletions.date, date)));
    if (existing) {
      await db.update(habitCompletions).set({ completed }).where(eq(habitCompletions.id, existing.id));
    } else {
      await db.insert(habitCompletions).values({ userId, habitId, date, completed });
    }
    res.json({ ok: true });
  });

  // Daily logs
  app.get("/api/daily-logs/:date", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const [log] = await db.select().from(dailyLogs)
      .where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, req.params.date)));
    res.json(log || { date: req.params.date, energyLevel: 5, moodNote: "" });
  });

  app.post("/api/daily-logs", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { date, energyLevel, moodNote } = req.body;
    const [existing] = await db.select().from(dailyLogs)
      .where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, date)));
    if (existing) {
      const [updated] = await db.update(dailyLogs).set({ energyLevel, moodNote }).where(eq(dailyLogs.id, existing.id)).returning();
      return res.json(updated);
    }
    const [created] = await db.insert(dailyLogs).values({ userId, date, energyLevel, moodNote }).returning();
    res.json(created);
  });

  app.get("/api/daily-logs", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const { start, end } = req.query;
    let result;
    if (start && end) {
      result = await db.select().from(dailyLogs)
        .where(and(eq(dailyLogs.userId, userId), between(dailyLogs.date, start as string, end as string)));
    } else {
      result = await db.select().from(dailyLogs).where(eq(dailyLogs.userId, userId));
    }
    res.json(result);
  });

  // Todos
  app.get("/api/todos/:date", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const result = await db.select().from(todos)
      .where(and(eq(todos.userId, userId), eq(todos.date, req.params.date)));
    res.json(result);
  });

  app.post("/api/todos", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const [todo] = await db.insert(todos).values({ userId, date: req.body.date, text: req.body.text }).returning();
    res.json(todo);
  });

  app.patch("/api/todos/:id", requireAuth, async (req: any, res) => {
    const [todo] = await db.update(todos).set(req.body).where(eq(todos.id, parseInt(req.params.id))).returning();
    res.json(todo);
  });

  app.delete("/api/todos/:id", requireAuth, async (req: any, res) => {
    await db.delete(todos).where(eq(todos.id, parseInt(req.params.id)));
    res.json({ ok: true });
  });

  // Permanent notes
  app.get("/api/notes", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const result = await db.select().from(permanentNotes).where(eq(permanentNotes.userId, userId));
    res.json(result);
  });

  app.post("/api/notes", requireAuth, async (req: any, res) => {
    const userId = req.session.userId;
    const [note] = await db.insert(permanentNotes).values({ userId, title: req.body.title || "", content: req.body.content || "" }).returning();
    res.json(note);
  });

  app.patch("/api/notes/:id", requireAuth, async (req: any, res) => {
    const [note] = await db.update(permanentNotes).set({ ...req.body, updatedAt: new Date() }).where(eq(permanentNotes.id, parseInt(req.params.id))).returning();
    res.json(note);
  });

  app.delete("/api/notes/:id", requireAuth, async (req: any, res) => {
    await db.delete(permanentNotes).where(eq(permanentNotes.id, parseInt(req.params.id)));
    res.json({ ok: true });
  });
}