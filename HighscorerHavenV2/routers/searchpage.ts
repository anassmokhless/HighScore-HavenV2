import { Router, Request, Response } from "express";
import { client } from "../database";
import { game } from "../types";

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
    const limit = 9;
    const skip = (page - 1) * limit;

    const filter = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

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
    });
  });

  return router;
}