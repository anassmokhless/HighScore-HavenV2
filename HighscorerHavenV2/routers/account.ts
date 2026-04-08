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
  return router;
}
