import express from "express";
import { gamesCollection, userCollection } from "../database";
import { requireAuth } from "../authentication/sessionHelper";
import { ObjectId } from "mongodb";
import { game, LoggedInUser, User } from "../types";

export function battleRouter() {
  const router = express.Router();

  router.get("/", requireAuth, async (req, res) => {
    // login?
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

      const games: game[] = await gamesCollection
        .aggregate<game>([{ $sample: { size: 6 } }])
        .toArray();

      const wins: number = user.stats.battle.wins;
      const losses: number = user.stats.battle.losses;
      const total: number = wins + losses;
      const winRate: number = total > 0 ? Math.round((wins / total) * 100) : 0;

      res.render("battle", {
        games,
        playerGame: null,
        systemGame: null,
        result: null,
        wins,
        losses,
        total,
        winRate,
        xp: user.stats.battle.xp,
      });
    } catch (e) {
      console.log(e);
    }
  });

  router.post("/result", requireAuth, async (req, res) => {
    try {
      const sessionUser: LoggedInUser = (req.session as any)
        .user as LoggedInUser;
      const playerGameId: number = parseInt(req.body.playerGame);

      const [user, playerGame, systemGameArr] = await Promise.all([
        userCollection.findOne<User>({ _id: new ObjectId(sessionUser.id) }),
        gamesCollection.findOne<game>({ id: playerGameId }),
        gamesCollection.aggregate<game>([{ $sample: { size: 1 } }]).toArray(),
      ]);

      if (!user || !playerGame) {
        res.redirect("/battle");
        return;
      }

      const systemGame: game = systemGameArr[0];
      const won: boolean = playerGame.rating > systemGame.rating;

      if (won) {
        await userCollection.updateOne(
          { _id: new ObjectId(sessionUser.id) },
          {
            $inc: {
              "stats.battle.wins": 1,
              "stats.battle.xp": 100,
            },
            $push: {
              xpHistory: {
                actie: "Battle - Gewonnen",
                xp: 100,
                datum: new Date().toISOString().slice(0, 16),
              },
            },
          },
        );
      } else {
        await userCollection.updateOne(
          { _id: new ObjectId(sessionUser.id) },
          {
            $inc: { "stats.battle.losses": 1 },
          },
        );
      }

      const updatedUser = await userCollection.findOne<User>({
        _id: new ObjectId(sessionUser.id),
      });

      if (!updatedUser) {
        res.redirect("/login");
        return;
      }

      const wins: number = updatedUser.stats.battle.wins;
      const losses: number = updatedUser.stats.battle.losses;
      const total: number = wins + losses;
      const winRate: number = total > 0 ? Math.round((wins / total) * 100) : 0;

      res.render("battle", {
        games: [],
        playerGame,
        systemGame,
        result: won ? "won" : "lost",
        wins,
        losses,
        total,
        winRate,
        xp: updatedUser.stats.battle.xp,
      });
    } catch (e) {
      console.log(e);
    }
  });

  return router;
}
