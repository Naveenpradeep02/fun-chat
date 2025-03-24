import express from "express";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import { app, server } from "./lib/socket.js";

import path from "path";

dotenv.config();

const Port = process.env.PORT;
app.use(express.json({ limit: "10mb" }));
const __dirname = path.resolve();

// app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

server.listen(Port, () => {
  console.log(`server is running on port ${Port}`);
  connectDB();
});
