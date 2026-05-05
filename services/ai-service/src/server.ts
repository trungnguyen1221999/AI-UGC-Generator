import "dotenv/config";
import projectRoutes from "./routes/projectRoutes.js";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import webHookRouter from "./routes/webHookRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

const defaultCorsOrigins = [
  "http://localhost:5173",
  "https://ai-ugc-generator-frontend.onrender.com",
  "https://kaiugc.org",
];

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : defaultCorsOrigins;

// CORS setup
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);

// Webhook — must use raw body for Clerk signature verification
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webHookRouter,
);

// All other routes use JSON body parser
app.use(express.json());
app.use(clerkMiddleware());

// Health check — for uptime monitoring and load balancer
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("Hello from Express + TypeScript backend!");
});

app.use("/api/users", userRouter);
app.use("/api/projects", projectRoutes);

// Global error handler — must be registered AFTER all routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
