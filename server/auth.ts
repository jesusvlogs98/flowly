import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, registerSchema, loginSchema } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }
  const { email, name, password } = parsed.data;

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(users).values({ email, name, passwordHash }).returning();

  (req.session as any).userId = user.id;
  res.json({ id: user.id, email: user.email, name: user.name });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }
  const { email, password } = parsed.data;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  (req.session as any).userId = user.id;
  res.json({ id: user.id, email: user.email, name: user.name });
}

export async function logout(req: Request, res: Response) {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
}

export async function getMe(req: Request, res: Response) {
  const userId = (req.session as any).userId;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return res.status(401).json({ message: "User not found" });

  res.json({ id: user.id, email: user.email, name: user.name });
}

export function requireAuth(req: Request, res: Response, next: any) {
  if (!(req.session as any).userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}
