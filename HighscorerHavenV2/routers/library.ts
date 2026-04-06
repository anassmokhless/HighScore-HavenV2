import { Router, Request, Response } from "express";
import { client } from "../index";
import { game } from "../types";

export function libraryRouter() {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    // loggedInUser komt later van een sessie, voorlopig leeg
    const libraryEntries: { gameId: number; status: string }[] = [];

    let games: game[] = [];
    if (libraryEntries.length > 0) {
      const ids = libraryEntries.map((e) => e.gameId);
      games = await client
        .db("HighscoreHaven")
        .collection("games")
        .find<game>({ id: { $in: ids } })
        .toArray();
    }

    res.render("library", {
      games,
      libraryEntries,
    });
  });

  return router;
}