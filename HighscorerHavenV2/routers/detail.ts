import { Router, Request, Response } from "express";
import { client } from "../database";
import { game } from "../types";

export function detailPageRouter() {
  const router = Router();

  router.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);

    const game = await client
      .db("HighscoreHaven")
      .collection("games")
      .findOne<game>({ id: id });

    if (!game) {
      res.status(404).send("Game niet gevonden");
      return;
    }

    res.render("detail", { game });
  });

  return router;
}
