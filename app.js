import dotenv from "dotenv";

dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticationRoute } from "./routes/authentication_routes.js";
import { attendanceRoutes } from "./routes/attendanceRoutes.js";

const app = express();

const PORT = process.env.SERVERPORT;

export const SESSION = new Map();

app.use(cors({

    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
});

app.use("/auth", authenticationRoute);
app.use("/attendance", attendanceRoutes);

app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}.`);
});