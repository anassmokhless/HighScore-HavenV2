import { ObjectId } from "mongodb";
import express from "express";
import { requireAuth } from "../authentication/sessionHelper";
import { LoggedInUser, User } from "../types";
import { userCollection } from "../database";

export function helpRouter() {
  const router = express.Router();

  router.get("/", requireAuth, async (req, res) => {
    try {
      const sessionUser: LoggedInUser = (req.session as any)
        .user as LoggedInUser;
      const user = await userCollection.findOne<User>({
        _id: new ObjectId(sessionUser.id),
      });

      if (!user) {
        res.redirect("/login");
        return;
      }
      res.render("help");
    } catch (e) {
      console.log(e);
    }
  });
  return router;
}
