import express from "express";
import { userCollection } from "../database";
import { requireAuth, stopSession } from "../authentication/sessionHelper";
import { LoggedInUser, User, XpHistoryEntry } from "../types";
import { ObjectId } from "mongodb";

function xpForLevel(level: number): number {
  return Math.floor(83 * Math.pow(1.05, level - 1));
}

function getLevelInfo(totalXp: number) {
  let level = 1;
  let xpSpent = 0;

  while (level < 99 && xpSpent + xpForLevel(level) <= totalXp) {
    xpSpent += xpForLevel(level);
    level++;
  }

  const xpIntoLevel = totalXp - xpSpent;
  const xpCurrentLevel = xpForLevel(level);

  return { level, xpIntoLevel, xpCurrentLevel };
}

export function accountrouter() {
  const router = express.Router();

  router.get("/", requireAuth, async (req, res) => {
    try {
      const sessionUser: LoggedInUser = (req.session as any)
        .user as LoggedInUser;
      const user: User | null = await userCollection.findOne<User>({
        _id: new ObjectId(sessionUser.id),
      });

      if (!user) {
        res.redirect("/login");
        return;
      }

      const xpHistory: XpHistoryEntry[] = [...user.xpHistory]
        .reverse()
        .slice(0, 10);

      const totalXP: number = user.stats.battle.xp + user.stats.guesser.xp;
      const xpInfo = getLevelInfo(totalXP);
      const xpToNextLevel: number = xpInfo.xpCurrentLevel - xpInfo.xpIntoLevel;

      res.render("account", {
        user: user,
        xpHistory: xpHistory,
        totalXp: totalXP,
        xpInfo: xpInfo,
        xpToNextLevel: xpToNextLevel,
      });
    } catch (e) {
      console.error(e);
      res.redirect("/login");
    }
  });

  router.post("/logout", stopSession);

  router.get("/edit", requireAuth, async (req, res) => {
    try {
      const sessionUser: LoggedInUser = (req.session as any)
        .user as LoggedInUser;
      const user: User | null = await userCollection.findOne<User>({
        _id: new ObjectId(sessionUser.id),
      });

      if (!user) {
        res.redirect("/login");
        return;
      }

      res.render("editAccount", {
        user: user,
        error: null,
      });
    } catch (e) {
      console.error(e);
      res.redirect("/account");
    }
  });

  router.post("/edit", requireAuth, async (req, res) => {
    try {
      const sessionUser: LoggedInUser = (req.session as any)
        .user as LoggedInUser;
      const name: string = req.body.name;
      const username: string = req.body.username;
      const email: string = req.body.email;
      const userId: ObjectId = new ObjectId(sessionUser.id);
      const user: User | null = await userCollection.findOne<User>({
        _id: userId,
      });

      if (!user) {
        res.redirect("/login");
      } else {
        let error: string | null = null;

        if (
          await userCollection.findOne({
            username: username,
            _id: { $ne: userId },
          })
        ) {
          error = "Gebruikersnaam is al in gebruik.";
        } else if (
          await userCollection.findOne({ email: email, _id: { $ne: userId } })
        ) {
          error = "E-mailadres is al in gebruik.";
        }

        if (error) {
          res.render("editAccount", {
            user: user,
            error: error,
          });
        } else {
          await userCollection.updateOne(
            { _id: userId },
            {
              $set: {
                name: name.trim(),
                username: username.trim(),
                email: email.trim(),
              },
            },
          );
          (req.session as any).user.username = username.trim();
          res.redirect("/account");
        }
      }
    } catch (e) {
      console.error(e);
      res.redirect("/account");
    }
  });
  return router;
}
