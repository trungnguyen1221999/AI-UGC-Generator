import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Known operational error — safe to expose message to client
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  // Unknown error — don't expose internals to client
  console.error("Unexpected error:", err);
  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong. Please try again.",
  });
};
