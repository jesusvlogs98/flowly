import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Monthly goals
export const monthlyGoals = pgTable("monthly_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  month: text("month").notNull(), // "YYYY-MM"
  mantra: text("mantra").default(""),
  mainGoal: text("main_goal").default(""),
  top3: jsonb("top_3").$type<string[]>().default([]),
});

// Habits (defined by user)
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Habit completions per day
export const habitCompletions = pgTable("habit_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  habitId: integer("habit_id").notNull(),
  date: text("date").notNull(), // "YYYY-MM-DD"
  completed: boolean("completed").default(false),
});

// Daily logs (energy + mood notes)
export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // "YYYY-MM-DD"
  energyLevel: integer("energy_level").default(5), // 1-10
  moodNote: text("mood_note").default(""),
});

// Todos per day
export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false),
});

// Permanent notes
export const permanentNotes = pgTable("permanent_notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull().default(""),
  content: text("content").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions table for connect-pg-simple
export const sessions = pgTable("session", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type User = typeof users.$inferSelect;
export type MonthlyGoal = typeof monthlyGoals.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type HabitCompletion = typeof habitCompletions.$inferSelect;
export type DailyLog = typeof dailyLogs.$inferSelect;
export type Todo = typeof todos.$inferSelect;
export type PermanentNote = typeof permanentNotes.$inferSelect;
