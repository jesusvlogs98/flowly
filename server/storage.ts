import { db } from "./db";
import { eq, and, between } from "drizzle-orm";
import { 
  monthlyGoals, habits, dailyLogs, habitCompletions, todos, persistentNotes,
  type MonthlyGoal, type Habit, type DailyLog, type HabitCompletion, type Todo, type PersistentNote,
  type InsertMonthlyGoal, type InsertHabit, type InsertDailyLog, type InsertTodo
} from "@shared/schema";

export interface IStorage {
  // Monthly Goals
  getMonthlyGoal(userId: string, month: string): Promise<MonthlyGoal | undefined>;
  upsertMonthlyGoal(goal: InsertMonthlyGoal): Promise<MonthlyGoal>;

  // Habits
  getHabits(userId: string): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  
  // Habit Completions
  getHabitCompletions(userId: string, start?: string, end?: string): Promise<HabitCompletion[]>;
  toggleHabitCompletion(userId: string, habitId: number, date: string, completed: boolean): Promise<boolean>;

  // Daily Logs
  getDailyLog(userId: string, date: string): Promise<DailyLog | undefined>;
  upsertDailyLog(log: InsertDailyLog): Promise<DailyLog>;

  // Todos
  getTodos(userId: string, date?: string): Promise<Todo[]>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, updates: Partial<InsertTodo>): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;

  // Persistent Notes
  getPersistentNote(userId: string): Promise<PersistentNote | undefined>;
  upsertPersistentNote(userId: string, content: string): Promise<PersistentNote>;
}

export class DatabaseStorage implements IStorage {
  // Monthly Goals
  async getMonthlyGoal(userId: string, month: string): Promise<MonthlyGoal | undefined> {
    const [goal] = await db.select().from(monthlyGoals).where(and(eq(monthlyGoals.userId, userId), eq(monthlyGoals.month, month)));
    return goal;
  }

  async upsertMonthlyGoal(goal: InsertMonthlyGoal): Promise<MonthlyGoal> {
    const [existing] = await db.select().from(monthlyGoals)
      .where(and(eq(monthlyGoals.userId, goal.userId), eq(monthlyGoals.month, goal.month)));

    if (existing) {
      const [updated] = await db.update(monthlyGoals)
        .set(goal)
        .where(eq(monthlyGoals.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(monthlyGoals).values(goal).returning();
      return created;
    }
  }

  // Habits
  async getHabits(userId: string): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.userId, userId));
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const [created] = await db.insert(habits).values(habit).returning();
    return created;
  }

  // Habit Completions
  async getHabitCompletions(userId: string, start?: string, end?: string): Promise<HabitCompletion[]> {
    let query = db.select().from(habitCompletions).where(eq(habitCompletions.userId, userId));
    if (start && end) {
      query = query.where(between(habitCompletions.date, start, end));
    }
    return await query;
  }

  async toggleHabitCompletion(userId: string, habitId: number, date: string, completed: boolean): Promise<boolean> {
    const [existing] = await db.select().from(habitCompletions)
      .where(and(eq(habitCompletions.userId, userId), eq(habitCompletions.habitId, habitId), eq(habitCompletions.date, date)));
    
    if (existing) {
      await db.update(habitCompletions)
        .set({ completed })
        .where(eq(habitCompletions.id, existing.id));
    } else {
      await db.insert(habitCompletions).values({ userId, habitId, date, completed });
    }
    return completed;
  }

  // Daily Logs
  async getDailyLog(userId: string, date: string): Promise<DailyLog | undefined> {
    const [log] = await db.select().from(dailyLogs).where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, date)));
    return log;
  }

  async upsertDailyLog(log: InsertDailyLog): Promise<DailyLog> {
    const [existing] = await db.select().from(dailyLogs)
      .where(and(eq(dailyLogs.userId, log.userId), eq(dailyLogs.date, log.date)));

    if (existing) {
      const [updated] = await db.update(dailyLogs)
        .set(log)
        .where(eq(dailyLogs.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(dailyLogs).values(log).returning();
      return created;
    }
  }

  // Todos
  async getTodos(userId: string, date?: string): Promise<Todo[]> {
    if (date) {
      return await db.select().from(todos).where(and(eq(todos.userId, userId), eq(todos.date, date)));
    }
    return await db.select().from(todos).where(eq(todos.userId, userId));
  }

  async createTodo(todo: InsertTodo): Promise<Todo> {
    const [created] = await db.insert(todos).values(todo).returning();
    return created;
  }

  async updateTodo(id: number, updates: Partial<InsertTodo>): Promise<Todo> {
    const [updated] = await db.update(todos).set(updates).where(eq(todos.id, id)).returning();
    return updated;
  }

  async deleteTodo(id: number): Promise<void> {
    await db.delete(todos).where(eq(todos.id, id));
  }

  // Persistent Notes
  async getPersistentNotes(userId: string): Promise<PersistentNote[]> {
    return await db.select().from(persistentNotes).where(eq(persistentNotes.userId, userId));
  }

  async getPersistentNote(id: number): Promise<PersistentNote | undefined> {
    const [note] = await db.select().from(persistentNotes).where(eq(persistentNotes.id, id));
    return note;
  }

  async createPersistentNote(userId: string, note: Partial<InsertPersistentNote>): Promise<PersistentNote> {
    const [created] = await db.insert(persistentNotes).values({
      userId,
      title: note.title || "Untitled Note",
      content: note.content || "",
    }).returning();
    return created;
  }

  async updatePersistentNote(id: number, updates: Partial<InsertPersistentNote>): Promise<PersistentNote> {
    const [updated] = await db.update(persistentNotes).set(updates).where(eq(persistentNotes.id, id)).returning();
    return updated;
  }

  async deletePersistentNote(id: number): Promise<void> {
    await db.delete(persistentNotes).where(eq(persistentNotes.id, id));
  }
}

export const storage = new DatabaseStorage();
