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
        req.user = (await User.findById(decoded.userId).select(
          "-password"
        )) as IUserDocument;
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
        req.user = (await User.findById(decoded.userId).select(
          "-password"
        )) as IUserDocument;
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
    if (user && user.role === "ADMIN") {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized as admin");
    }
  }
);

const authorize = (...roles: UserRole[]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!roles.includes((req.user as IUserDocument).role as UserRole)) {
      return next(
        new Error(
          `User role ${
            (req.user as IUserDocument).role
          } is not authorized to access this route`
        )
      );
    }
    next();
  };
};

export { authorize, ensureAuth, ensureGuest, isAdmin };
