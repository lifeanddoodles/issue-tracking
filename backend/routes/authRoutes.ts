import express from "express";
import passport from "passport";
import { ensureAuth, ensureGuest } from "../middleware/auth.js";

const router = express.Router();

// AUTHENTICATE
// @desc Authenticate with email and password
// @route POST /api/auth/login
// @access Public
router.post(
  "/login",
  ensureGuest,
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

// @desc Authenticate with Google
// @route GET /api/auth/google
// @access Public
router.get(
  "/google",
  ensureGuest,
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// @desc Get Google authentication callback
// @route GET /api/auth/google/callback
// @access Public
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// LOGOUT
// @desc Logout user
// @route GET /api/auth/logout
// @access Private
router.get("/logout", ensureAuth, (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
});

export default router;
