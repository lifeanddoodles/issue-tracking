import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IUserDocument, UserRole } from "../../shared/interfaces/index.ts";
import User from "../models/userModel.ts";

const ensureAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as Secret
        ) as JwtPayload;
        req.user = await User.findById(decoded.userId).select("-password");
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

const ensureGuest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    token = req.cookies.jwt;
    if (!token) {
      next();
    } else {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as Secret
        ) as JwtPayload;
        req.user = await User.findById(decoded.userId).select("-password");
        res.send({ message: "User already logged in" });
      } catch (error) {
        next();
      }
    }
  }
);

const isAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as Partial<IUserDocument>;
    if (user && user.role === UserRole.ADMIN) {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized as admin");
    }
  }
);

export { ensureAuth, ensureGuest, isAdmin };
