import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./config/passport";

// routes
import authRoute from "./routes/auth";
import contractsRoute from "./routes/contracts";
import paymentsRoute from "./routes/payments";
import { handleWebhook } from "./controllers/payment.controller";

const app = express();

app.set('trust proxy', 1);

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
    })
  );
app.use(morgan("dev"));

app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI! }),
    cookie: {
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
    },
    proxy: true
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/contracts", contractsRoute);
app.use("/payments", paymentsRoute);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});