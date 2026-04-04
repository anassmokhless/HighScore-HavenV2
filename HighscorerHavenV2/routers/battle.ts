import express from "express";
import {
  gamesQuery as gamesCollection,
  usersQuery as usersCollection,
} from "../index";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/battle", async (req, res) => {
  if (!(req.session as any).user) {
    return res.redirect("/login");
  }

  const sessionUser = (req.session as any).user;

  const [user, games] = await Promise.all([
    usersCollection.findOne({ _id: new ObjectId(sessionUser.id) }),
    gamesCollection.aggregate([{ $sample: { size: 6 } }]).toArray(),
  ]);

  res.render("battle", { games, playerGame: null, user });
});

router.post("/battle", async (req, res) => {
  if (!(req.session as any).user) {
    return res.redirect("/login");
  }

  const sessionUser = (req.session as any).user;
  const playerGameId = parseInt(req.body.playerGame);

  const [user, games, playerGame] = await Promise.all([
    usersCollection.findOne({ _id: new ObjectId(sessionUser.id) }),
    gamesCollection.aggregate([{ $sample: { size: 6 } }]).toArray(),
    gamesCollection.findOne({ id: playerGameId }),
  ]);

  if (!user || !playerGame) {
    return res.redirect("/battle");
  }

  // games[0] is de systeemgame
  const systemGame = games[0];
  const won = playerGame.rating > systemGame.rating;

  await usersCollection.updateOne(
    { _id: new ObjectId(sessionUser.id) },
    {
      $inc: {
        "stats.battle.wins": won ? 1 : 0,
        "stats.battle.losses": won ? 0 : 1,
        "stats.battle.xp": won ? 100 : 0,
      },
    },
  );

  const updatedUser = await usersCollection.findOne({
    _id: new ObjectId(sessionUser.id),
  });

  res.render("battle", { games, playerGame, user: updatedUser });
});

export default router;
