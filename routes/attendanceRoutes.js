import express from "express";
import { getUserAttendance, addAttendance, deleteAttendance } from "../controllers/attendance_controller.js";
import { checkIfAuthenticated } from "../controllers/authentication_controller.js";

export const attendanceRoutes = express.Router();

attendanceRoutes.get("/", checkIfAuthenticated, getUserAttendance);

attendanceRoutes.post("/add", checkIfAuthenticated, addAttendance);

attendanceRoutes.delete("/delete/:id", checkIfAuthenticated, deleteAttendance);