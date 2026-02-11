import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js"
import seedAdmin from "./seeders/adminSeeder.js";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:4201", "http://localhost:60421"],
    credentials: true,
  }),
);

connectDB().then(() => {
  seedAdmin();
})

app.use("/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("API is Running")
});

app.use("/auth", authRoutes)

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[Error] ${err.message}`);
  if (err.stack) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`server starter running at http://localhost:${port}`);
})