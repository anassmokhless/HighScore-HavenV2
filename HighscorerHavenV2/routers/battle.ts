import express from "express";
import { gamesCollection, userCollection } from "../database";
import { ObjectId } from "mongodb";

export function battleRouter() {
  const router = express.Router();

  // GET battle page
  router.get("/battle", async (req, res) => {
    if (!(req.session as any).user) {
      return res.redirect("/login");
    }

    const sessionUser = (req.session as any).user;

    const [user, games] = await Promise.all([
      userCollection.findOne({ _id: new ObjectId(sessionUser.id) }),
      gamesCollection.aggregate([{ $sample: { size: 6 } }]).toArray(),
    ]);

    res.render("battle", {
      games,
      playerGame: null,
      systemGame: null,
      won: null,
      user,
    });
  });

  // POST battle result
  router.post("/battle", async (req, res) => {
    if (!(req.session as any).user) {
      return res.redirect("/login");
    }

    const sessionUser = (req.session as any).user;
    const playerGameId = parseInt(req.body.playerGame);

    const [user, games, playerGame] = await Promise.all([
      userCollection.findOne({ _id: new ObjectId(sessionUser.id) }),
      gamesCollection.aggregate([{ $sample: { size: 6 } }]).toArray(),
      gamesCollection.findOne({ id: playerGameId }),
    ]);

    if (!user || !playerGame) {
      return res.redirect("/battle");
    }

    const systemGame = games[0];
    const won = playerGame.rating > systemGame.rating;

    await userCollection.updateOne(
      { _id: new ObjectId(sessionUser.id) },
      {
        $inc: {
          "stats.battle.wins": won ? 1 : 0,
          "stats.battle.losses": won ? 0 : 1,
          "stats.battle.xp": won ? 100 : 0,
        },
      },
    );

    const updatedUser = await userCollection.findOne({
      _id: new ObjectId(sessionUser.id),
    });

    res.render("battle", {
      games,
      playerGame,
      systemGame,
      won,
      user: updatedUser,
    });
  });

  return router;
}
