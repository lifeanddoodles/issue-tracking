import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt, { Secret } from "jsonwebtoken";
import passport from "passport";
import { IUserDocument } from "../../shared/interfaces/index.ts";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.ts";

dotenv.config();
const NODE_ENV = process.env.NODE_ENV || "development";
const BASE_URL = NODE_ENV === "development" ? "http://localhost:5173" : "";

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
      generateTokenAndSetCookie(res, user._id);

      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department,
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
  async (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate("google", {
      scope: ["profile"],
    })(req, res, next)
);

// @desc Get Google authentication callback
// @route GET /api/auth/google/callback
// @access Public
export const getGoogleLoginCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate(
      "google",
      {
        successRedirect: `/api/auth/success`,
        failureRedirect: `${BASE_URL}/login`,
        session: false,
      },
      (err: unknown, user: IUserDocument | null, info) => {
        if (err) return res.json({ message: err });
        if (!user)
          return res.status(401).json({ message: "Authentication failed" });

        req.login(user, (err: unknown) => {
          if (err) {
            return next(err);
          }

          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as Secret,
            {
              expiresIn: "30d",
            }
          );
          // Set the token in a cookie or in the response body as needed
          res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
          res.status(info.statusCode).redirect(`/api/auth/success`);
        });
      }
    )(req, res, next)
);

// REDIRECT AFTER SUCCESSFUL LOGIN
// @desc Redirect user
// @route GET /api/auth/success
// @access Private
export const loginSuccess = asyncHandler(
  async (req: Request, res: Response) => {
    res.redirect(`${BASE_URL}/login/success`);
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
