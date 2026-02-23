import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import { registerRoutes } from "../server/routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PgSession = connectPgSimple(session);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(
  session({
    secret: process.env.SESSION_SECRET || "flowly-secret",
    resave: false,
    saveUninitialized: false,
    store: new PgSession({ pool, tableName: "session" }),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
