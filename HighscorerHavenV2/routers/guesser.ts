import { Router } from "express";
import { ObjectId } from "mongodb";
import { gamesCollection, userCollection } from "../database";
import { requireAuth } from "../authentication/sessionHelper";
import { game, LoggedInUser, User } from "../types";

export function geusserRouter() {
  const router = Router();

  router.get("/", requireAuth, async (req, res) => {
    try {
      const sessionUser: LoggedInUser = (req.session as any)
        .user as LoggedInUser;
      const user = await userCollection.findOne<User>({
        _id: new ObjectId(sessionUser.id),
      });

      if (!user) {
        res.redirect("login");
        return;
      }

      const [correctGame]: game[] = await gamesCollection
        .aggregate<game>([{ $sample: { size: 1 } }])
        .toArray();
      const decoys: game[] = await gamesCollection
        .aggregate<game>([{ $sample: { size: 4 } }])
        .toArray();

      const gameOptions: game[] = [correctGame, ...decoys].sort(
        () => Math.random() - 0.5,
      );

      const correct: number = user.stats.guesser.correct;
      const wrong: number = user.stats.guesser.fout;
      const total: number = correct + wrong;
      const accuracy: number =
        total > 0 ? Math.round((correct / total) * 100) : 0;

      res.render("guesser", {
        correctGame: correctGame,
        gameOptions: gameOptions,
        result: null,
        chosenGame: null,
        correct: correct,
        wrong: wrong,
        total: total,
        accuracy: accuracy,
        xp: user.stats.guesser.xp,
      });
    } catch (e) {}
  });

  return router;
}
