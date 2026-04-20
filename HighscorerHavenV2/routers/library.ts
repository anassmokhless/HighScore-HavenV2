import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { client } from "../database";
import { game, User, LibraryEntry } from "../types";
import { requireAuth } from "../authentication/sessionHelper";

export function libraryRouter() {
  const router = Router();

  router.get("/", requireAuth, async (req: Request, res: Response) => {
    const sessionUser = (req.session as any).user as { id: string; username: string; avatar: string };

    const user = await client
      .db("HighscoreHaven")
      .collection("Users")
      .findOne<User>({ _id: new ObjectId(sessionUser.id) });

    const libraryEntries: LibraryEntry[] = user?.library ?? [];

    let games: game[] = [];
    if (libraryEntries.length > 0) {
      const ids = libraryEntries.map((e) => e.gameId);
      games = await client
        .db("HighscoreHaven")
        .collection("games")
        .find<game>({ id: { $in: ids } })
        .toArray();
    }

    res.render("library", { games, libraryEntries });
  });
  router.post("/delete/:gameId", requireAuth, async (req: Request, res: Response) => {
    const gameId = parseInt(req.params.gameId as string);
    const sessionUser = (req.session as any).user as { id: string; username: string; avatar: string };

    await client
      .db("HighscoreHaven")
      .collection("Users")
      .updateOne(
        { _id: new ObjectId(sessionUser.id) },
        { $pull: { library: { gameId: gameId } } } as any,
      );

    res.redirect("/library");
  });

  return router;
}