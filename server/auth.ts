import bcrypt from "bcryptjs";
import { db } from "./db.js";
import { users, registerSchema, loginSchema } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

function makeToken(userId: number): string {
  const payload = Buffer.from(JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString("base64url");
  return payload;
}

function verifyToken(token: string): number | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return payload.userId;
  } catch {
    return null;
  }
}

function setAuthCookie(res: Response, userId: number) {
  const token = makeToken(userId);
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

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
  setAuthCookie(res, user.id);
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
  setAuthCookie(res, user.id);
  res.json({ id: user.id, email: user.email, name: user.name });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("auth_token", { path: "/", sameSite: "none", secure: true });
  res.json({ ok: true });
}

export async function getMe(req: Request, res: Response) {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  const userId = verifyToken(token);
  if (!userId) return res.status(401).json({ message: "Not authenticated" });
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return res.status(401).json({ message: "User not found" });
  res.json({ id: user.id, email: user.email, name: user.name });
}

export function requireAuth(req: Request, res: Response, next: any) {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  const userId = verifyToken(token);
  if (!userId) return res.status(401).json({ message: "Not authenticated" });
  (req as any).userId = userId;
  next();
}