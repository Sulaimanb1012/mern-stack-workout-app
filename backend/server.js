import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import workoutsRoutes from "./src/routes/workouts.js";
import authRoutes from "./src/routes/authRoutes.js"; // 👈 deze heb je al

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS (DEV)
app.use(cors());

// JSON middleware
app.use(express.json());

// ROUTES
app.use("/api/workouts", workoutsRoutes);
app.use("/api/auth", authRoutes); // ✅ DIT WAS DE MISSENDE REGEL

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Mijn eerste backend!",
    success: true,
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server draait op http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connect error:", error.message);
  });
