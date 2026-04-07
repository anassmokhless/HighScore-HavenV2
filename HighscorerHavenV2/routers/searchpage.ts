import { Router, Request, Response } from "express";
import {client} from "../database"
import { game } from "../types";

export function searchPageRouter() {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const total = await client.db("HighscoreHaven").collection("games").countDocuments();
    const totalPages = Math.ceil(total / limit);

    const games: game[] = await client
      .db("HighscoreHaven")
      .collection("games")
      .find<game>({})
      .skip(skip)
      .limit(limit)
      .toArray();

    res.render("searchpage", {
      title: "Search",
      games: games,
      currentPage: page,
      totalPages: totalPages,
    });
  });

  return router;
}