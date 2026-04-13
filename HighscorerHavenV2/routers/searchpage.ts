import { Router, Request, Response } from "express";
import { client } from "../database";
import { game } from "../types";

const TAGS = [
  "action", "adventure", "puzzle", "horror", "strategy",
  "survival", "simulation", "racing", "casual", "singleplayer",
  "multiplayer", "co-op", "indie", "fps"
];

const TAG_TRANSLATIONS: Record<string, string> = {
  "action":       "Actie",
  "adventure":    "Avontuur",
  "puzzle":       "Puzzel",
  "horror":       "Horror",
  "strategy":     "Strategie",
  "survival":     "Survival",
  "simulation":   "Simulatie",
  "racing":       "Racen",
  "casual":       "Casual",
  "singleplayer": "Singleplayer",
  "multiplayer":  "Multiplayer",
  "co-op":        "Co-op",
  "indie":        "Indie",
  "fps":          "Fps"
};

export function searchPageRouter() {
  const router = Router();

  router.get("/suggest", async (req: Request, res: Response) => {
    const search = req.query.search as string || '';

    if (search.length < 2) {
      res.json([]);
      return;
    }

    const games = await client
      .db("HighscoreHaven")
      .collection("games")
      .find<game>({ name: { $regex: search, $options: 'i' } })
      .limit(3)
      .toArray();

    res.json(games.map(g => ({ id: g.id, name: g.name, background_image: g.background_image })));
  });

  router.get("/", async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string || '';
    const selectedTags = req.query.tags ? (req.query.tags as string).split(',') : [];
    const limit = 9;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
if (selectedTags.length > 0) {
  filter['$or'] = [
    { 'tags': { $elemMatch: { slug: { $in: selectedTags } } } },
    { 'genres': { $elemMatch: { slug: { $in: selectedTags } } } }
  ];
}

    const total = await client.db("HighscoreHaven").collection("games").countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const games: game[] = await client
      .db("HighscoreHaven")
      .collection("games")
      .find<game>(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.render("searchpage", {
      title: "Search",
      games,
      currentPage: page,
      totalPages,
      search,
      selectedTags,
      tags: TAGS,
      tagTranslations: TAG_TRANSLATIONS,
    });
  });

  return router;}