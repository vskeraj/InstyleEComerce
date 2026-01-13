import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { uptime } from "process";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { shouldBeUser } from "./middleware/authMiddleware.js";

const app = new Hono();

app.use("*", clerkMiddleware());

app.get("/api/v1/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.get("/api/v1/test", shouldBeUser, async (c) => {
  return c.json({
    message: "Payment service authenticated",
    userId: c.get("userId"),
  });
});

const start = async () => {
  try {
    serve({ fetch: app.fetch, port: 8002 }, (info) => {
      console.log("Payment service is running on port 8002");
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
