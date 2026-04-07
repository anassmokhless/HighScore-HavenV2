import { Request, Response, NextFunction } from "express";
import { LoggedInUser } from "../types";

export function createUserSession(req: Request, user: LoggedInUser): void {
  (req.session as any).user = {
    id: user._id,
    username: user.username,
    avatar: user.avatar,
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if ((req.session as any).user) {
    next();
  } else {
    res.redirect("/login?error=NotLoggedIn");
  }
}