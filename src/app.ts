import "./config/passport";
import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./routes";
import { globalErrorHandler } from "./middlewares/global-error-handler";
import notFound from "./middlewares/not-found";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./config/env";

const app = express();

app.use(
	expressSession({
		secret: "secret",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: envVars.FRONTEND_URL,
		credentials: true,
	})
);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
	res.status(200).send("Welcome to the Tour Management System");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
