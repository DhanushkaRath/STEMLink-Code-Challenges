import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error";
import { getAuth } from "@clerk/express";

// Define a custom interface for the request object
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    // Now TypeScript knows about userId on the request object
    req.userId = userId;
    next();
  } catch (error) {
    console.log("Auth Error:", error); // Debug log
    next(new UnauthorizedError("Unauthorized"));
  }
};
