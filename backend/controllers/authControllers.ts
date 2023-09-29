import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import { IUserDocument } from "../../shared/interfaces/index.ts";
import generateToken from "../utils/generateToken.ts";

// AUTHENTICATE
// @desc Authenticate with email and password
// @route POST /api/auth/login
// @access Public
export const loginWithEmailAndPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
    },
    function (err: unknown, user: IUserDocument | null, info: string) {
      const error = err || info;
      if (error) return res.json({ message: error });
      if (!user)
        return res.status(401).json({ message: "Authentication failed" });
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        company: user.company,
        position: user.position,
        avatarUrl: user.avatarUrl,
      });
    }
  )(req, res, next);
};

// @desc Authenticate with Google
// @route GET /api/auth/google
// @access Public
export const loginWithGoogle = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      {
        scope: ["profile"],
      },
      function (err: unknown, user: IUserDocument | null, info: string) {
        const error = err || info;
        if (error) return res.json({ message: error });
        if (!user)
          return res.status(401).json({ message: "Authentication failed" });
        generateToken(res, user._id);

        res.status(200).json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          company: user.company,
          position: user.position,
          avatarUrl: user.avatarUrl,
        });
      }
    )(req, res, next);
  }
);

// @desc Get Google authentication callback
// @route GET /api/auth/google/callback
// @access Public
export const getGoogleLoginCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login",
    });
  }
);

// LOGOUT
// @desc Logout user
// @route GET /api/auth/logout
// @access Private
export const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    req.logout((error) => {
      if (error) {
        return next(error);
      }
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.redirect("/");
    });
  }
);
