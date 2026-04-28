import express from "express";
import { ObjectId } from "mongodb";
import { gamesCollection, userCollection } from "../database";
import { requireAuth } from "../authentication/sessionHelper";
import { game, LoggedInUser, User } from "../types";

export function battleRouter() {
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

      const games: game[] = await gamesCollection
        .aggregate<game>([{ $sample: { size: 5 } }])
        .toArray();
      const systeemGames: game[] = await gamesCollection
        .aggregate<game>([{ $sample: { size: 1 } }])
        .toArray();

      const wins: number = user.stats.battle.wins;
      const losses: number = user.stats.battle.losses;
      const total: number = wins + losses;
      const winRate: number = total > 0 ? Math.round((wins / total) * 100) : 0;

      res.render("battle", {
        games,
        systeemGames,
        result: null,
        playerGame: null,
        systemGame: null,
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

  router.post("/", requireAuth, async (req, res) => {
    try {
      const sessionUser: LoggedInUser = (req.session as any)
        .user as LoggedInUser;
      const playerGameName: string = req.body.playerGame;

      const [playerGame, systeemGamesArr] = await Promise.all([
        gamesCollection.findOne<game>({ name: playerGameName }),
        gamesCollection.aggregate<game>([{ $sample: { size: 1 } }]).toArray(),
      ]);

      const systemGame = systeemGamesArr[0];

      if (!playerGame || !systemGame) {
        res.status(404).send("Game niet gevonden.");
        return;
      }

      const playerWins: boolean = playerGame.rating >= systemGame.rating;
      const result: string = playerWins ? "won" : "lost";

      if (playerWins) {
        await userCollection.updateOne(
          { _id: new ObjectId(sessionUser.id) },
          {
            $inc: { "stats.battle.wins": 1, "stats.battle.xp": 100 },
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
          { $inc: { "stats.battle.losses": 1 } },
        );
      }

      const [user, games, systeemGames] = await Promise.all([
        userCollection.findOne<User>({ _id: new ObjectId(sessionUser.id) }),
        gamesCollection.aggregate<game>([{ $sample: { size: 5 } }]).toArray(),
        gamesCollection.aggregate<game>([{ $sample: { size: 1 } }]).toArray(),
      ]);

      if (!user) {
        res.redirect("/login");
        return;
      }

      const wins: number = user.stats.battle.wins;
      const losses: number = user.stats.battle.losses;
      const total: number = wins + losses;
      const winRate: number = total > 0 ? Math.round((wins / total) * 100) : 0;

      res.render("battle", {
        games,
        systeemGames,
        result,
        playerGame,
        systemGame,
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

  return router;
}
