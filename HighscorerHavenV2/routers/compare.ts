import express from "express";
import { gamesCollection } from "../database";
import { requireAuth } from "../authentication/sessionHelper";
import { game } from "../types";

export function compareRouter() {
  const router = express.Router();

  router.get("/", requireAuth, (req, res) => {
    res.render("compare", { game1: null, game2: null });
  });

  // Compare form verwerken
  router.post("/", requireAuth, async (req, res) => {
    const { game1Name, game2Name } = req.body;

    const [game1, game2] = await Promise.all([
      gamesCollection.findOne<game>({
        name: { $regex: game1Name, $options: "i" },
      }),
      gamesCollection.findOne<game>({
        name: { $regex: game2Name, $options: "i" },
      }),
    ]);

    res.render("compare", { game1, game2 });
  });

  // Autocomplete
  router.get("/search", requireAuth, async (req, res) => {
    const query = req.query.q as string;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const games = await gamesCollection
      .find({ name: { $regex: query, $options: "i" } })
      .project({ id: 1, name: 1 })
      .limit(5)
      .toArray();

    res.json(games);
  });

  return router;
}
