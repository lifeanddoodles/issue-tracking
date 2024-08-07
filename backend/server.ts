import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js";
import configPassport from "./config/passport.js";
import { ensureAuth } from "./middleware/authMiddleware.ts";
import { handleError } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

// Passport config
configPassport(passport);

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Sessions
app.use(
  session({
    secret: "surprised-pikachu-face",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global user
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(`/api/${process.env.API_VERSION}/auth`, authRoutes);
app.use(`/api/${process.env.API_VERSION}/users`, userRoutes);
app.use(`/api/${process.env.API_VERSION}/tickets`, ensureAuth, ticketRoutes);
app.use(`/api/${process.env.API_VERSION}/comments`, ensureAuth, commentRoutes);
app.use(`/api/${process.env.API_VERSION}/companies`, companyRoutes);
app.use(`/api/${process.env.API_VERSION}/projects`, ensureAuth, projectRoutes);
app.use(`/api/${process.env.API_VERSION}/services`, ensureAuth, serviceRoutes);

// Error handler
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
