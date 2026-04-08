import express from "express";
import { userCollection } from "../database";
import { requireAuth } from "../authentication/sessionHelper";
import {
  findAndValidateUser,
  hashPassword,
} from "../authentication/authService";
import { LoggedInUser, User } from "../types";
import { ObjectId } from "mongodb";

export function changePwRouter() {
  const router = express.Router();

  router.get("/", requireAuth, (req, res) => {
    res.render("changePw", {
      error: null,
      success: null,
    });
  });

  router.post("/", requireAuth, async (req, res) => {
    try {
      const sessionUser: LoggedInUser = (req.session as any)
        .user as LoggedInUser;
      const oldPw: string = req.body.oldPw;
      const newPw: string = req.body.newPw;
      const repeatPw: string = req.body.repeatPw;

      const user: User | null = await findAndValidateUser(
        sessionUser.username,
        oldPw,
      );

      if (!user) {
        res.render("changePw", {
          error: "Huidig wachtwoord is onjuist.",
          success: null,
        });
      } else if (newPw !== repeatPw) {
        res.render("changePw", {
          error: "Wachtwoorden komen niet overeen.",
          success: null,
        });
      } else {
        await userCollection.updateOne(
          { _id: new ObjectId(sessionUser.id) },
          { $set: { password: await hashPassword(newPw) } },
        );
        res.render("changePw", {
          error: null,
          success: "Wachtwoord succesvol gewijzigd.",
        });
      }
    } catch (e) {
      console.error(e);
      res.redirect("/account");
    }
  });

  return router;
}
