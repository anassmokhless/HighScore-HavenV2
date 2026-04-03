import express from "express";
import { gamesQuery as gamesCollection } from "../index";

const router = express.Router();

// Compare pagina tonen
router.get("/compare", (req, res) => {
  if (!(req.session as any).user) {
    return res.redirect("/login");
  }
  res.render("compare", { game1: null, game2: null });
});

export default router;
