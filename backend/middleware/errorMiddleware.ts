import { Request, Response } from "express";

export const handleError = (
  error: Error,
  req: Request,
  res: Response,
  next: Function
) => {
  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: error.message || error,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};
