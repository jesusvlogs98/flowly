export * from "./models/auth";
import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
});

export const monthlyGoals = pgTable("monthly_goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Changed to text to match Replit Auth ID (varchar)
  month: text("month").notNull(), // Format: "YYYY-MM"
  mantra: text("mantra").default(""),
  mainGoal: text("main_goal").default(""),
  top3: jsonb("top_3").$type<string[]>().default([]),
});

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  active: boolean("active").default(true),
});

export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(), // Format: "YYYY-MM-DD"
  energyLevel: integer("energy_level").default(5), // 1-10
  notes: text("notes").default(""),
});

export const habitCompletions = pgTable("habit_completions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  habitId: integer("habit_id").notNull(),
  date: text("date").notNull(), // Format: "YYYY-MM-DD"
  completed: boolean("completed").default(false),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(), // Format: "YYYY-MM-DD"
  text: text("text").notNull(),
  completed: boolean("completed").default(false),
});

export const persistentNotes = pgTable("permanent_notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull().default("Untitled Note"),
  content: text("content").notNull().default(""),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMonthlyGoalSchema = createInsertSchema(monthlyGoals);
export const insertHabitSchema = createInsertSchema(habits);
export const insertDailyLogSchema = createInsertSchema(dailyLogs);
export const insertHabitCompletionSchema = createInsertSchema(habitCompletions);
export const insertTodoSchema = createInsertSchema(todos);
export const insertPersistentNoteSchema = createInsertSchema(persistentNotes).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type MonthlyGoal = typeof monthlyGoals.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type DailyLog = typeof dailyLogs.$inferSelect;
export type HabitCompletion = typeof habitCompletions.$inferSelect;
export type Todo = typeof todos.$inferSelect;
export type PersistentNote = typeof persistentNotes.$inferSelect;
export type InsertPersistentNote = z.infer<typeof insertPersistentNoteSchema>;
