import { Request, Response, NextFunction } from "express";
import ForbiddenError from "../../domain/errors/forbidden-error";
import { getAuth } from "@clerk/express";

// Add array of admin user IDs (you should store these securely, this is just an example)
const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(',') || [];

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      throw new ForbiddenError("Forbidden");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Add isAdmin middleware
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    if (!userId || !ADMIN_USER_IDS.includes(userId)) {
      throw new ForbiddenError("Admin access required");
    }
    next();
  } catch (error) {
    next(error);
  }
};