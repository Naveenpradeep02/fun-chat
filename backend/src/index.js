import express from "express";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import { app, server } from "./lib/socket.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const Port = process.env.PORT || 8000;
app.use(express.json({ limit: "10mb" }));
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
const frontendBuildPath = path.resolve(__dirname, "../../frontend/build");

// app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: frontendOrigin, credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

connectDB().then(() => {
  server.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
  });
});
