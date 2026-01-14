import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import workoutsRoutes from "./src/routes/workouts.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware: lees JSON
app.use(express.json());

// Routes
app.use("/api/workouts", workoutsRoutes);

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
