import express from "express";
import { gamesQuery as gamesCollection } from "../index";

const router = express.Router();


router.get("/compare", (req, res) => {
  if (!(req.session as any).user) {
    return res.redirect("/login");
  }
  res.render("compare", { game1: null, game2: null });
});

// Compare form verwerken
router.post("/compare", async (req, res) => {
  if (!(req.session as any).user) {
    return res.redirect("/login");
  }

  const { game1Name, game2Name } = req.body;

  const [game1, game2] = await Promise.all([
    gamesCollection.findOne({ name: { $regex: game1Name, $options: "i" } }),
    gamesCollection.findOne({ name: { $regex: game2Name, $options: "i" } }),
  ]);

  res.render("compare", { game1, game2 });
});

// Autocomplete
router.get("/compare/search", async (req, res) => {
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

export default router;
