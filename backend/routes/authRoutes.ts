import express from "express";
import {
  getGoogleLoginCallback,
  loginWithEmailAndPassword,
  loginWithGoogle,
  logoutUser,
} from "../controllers/authControllers.ts";
import { ensureAuth, ensureGuest } from "../middleware/authMiddleware.ts";

const router = express.Router();

// AUTHENTICATE
// @desc Authenticate with email and password
// @route POST /api/auth/login
// @access Public
router.post("/login", ensureGuest, loginWithEmailAndPassword);

// @desc Authenticate with Google
// @route GET /api/auth/google
// @access Public
router.get("/google", ensureGuest, loginWithGoogle);

// @desc Get Google authentication callback
// @route GET /api/auth/google/callback
// @access Public
router.get("/google/callback", getGoogleLoginCallback);

// LOGOUT
// @desc Logout user
// @route GET /api/auth/logout
// @access Private
router.get("/logout", ensureAuth, logoutUser);

export default router;
