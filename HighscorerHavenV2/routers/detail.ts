import { Router, Request, Response } from "express";
import { client } from "../database";
import { ObjectId } from "mongodb";
import { game, User, LibraryEntry } from "../types";
import { requireAuth } from "../authentication/sessionHelper";

export function detailPageRouter() {
  const router = Router();

  router.get("/:id", requireAuth, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);

    const game = await client
      .db("HighscoreHaven")
      .collection("games")
      .findOne<game>({ id: id });

    if (!game) {
      res.status(404).send("Game niet gevonden");
      return;
    }

    const sessionUser = (req.session as any).user as {
      id: string;
      username: string;
      avatar: string;
    };

    const user = await client
      .db("HighscoreHaven")
      .collection("Users")
      .findOne<User>({ _id: new ObjectId(sessionUser.id) });

    const libraryEntry =
      user?.library?.find((e: LibraryEntry) => e.gameId === id) ?? null;

    res.render("detail", { game, libraryEntry });
  });

  router.post(
    "/:id/status",
    requireAuth,
    async (req: Request, res: Response) => {
      const gameId = parseInt(req.params.id as string);
      const { status } = req.body as { status: string };
      const sessionUser = (req.session as any).user as {
        id: string;
        username: string;
        avatar: string;
      };

      const user = await client
        .db("HighscoreHaven")
        .collection("Users")
        .findOne<User>({ _id: new ObjectId(sessionUser.id) });

      const userHasGame = user?.library?.some(
        (e: LibraryEntry) => e.gameId === gameId,
      );

      if (userHasGame) {
        await client
          .db("HighscoreHaven")
          .collection("Users")
          .updateOne(
            { _id: new ObjectId(sessionUser.id) },
            { $set: { "library.$[entry].status": status } },
            { arrayFilters: [{ "entry.gameId": gameId }] },
          );
      } else {
        await client
          .db("HighscoreHaven")
          .collection("Users")
          .updateOne({ _id: new ObjectId(sessionUser.id) }, {
            $push: { library: { gameId: gameId, status: status } },
          } as any);
      }

      res.redirect(`/detail/${gameId}`);
    },
  );

  return router;
}
