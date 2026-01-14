import express from "express";
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
} from "../controllers/workoutController.js";

const router = express.Router();


router.get("/", getAllWorkouts);


router.get("/:id", getWorkoutById);


router.post("/", createWorkout);

export default router;
