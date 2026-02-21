import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "../server/routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Store = MemoryStore(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "flowly-secret",
    resave: false,
    saveUninitialized: false,
    store: new Store({ checkPeriod: 86400000 }),
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

registerRoutes(app);

export default function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (err: any) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
}