import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

connectDB()
 
app.get("/", (req, res) => {
    res.send("API is Running")
});

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server starter running at http://localhost:${port}`);
})