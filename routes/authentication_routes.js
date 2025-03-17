
import express from "express";
import passport from "passport";
import { registerUser, checkDuplicateUsername, logout, loginUser, checkIfAuthenticated, protectRoute } from "../controllers/authentication_controller.js";
import { SESSION } from "../app.js";
import { System } from "../models/system.js";

export const authenticationRoute = express.Router();

authenticationRoute.post("/register", checkDuplicateUsername, registerUser);
authenticationRoute.post("/login", loginUser);
authenticationRoute.get("/check-auth", protectRoute);
authenticationRoute.delete("/logout", logout)