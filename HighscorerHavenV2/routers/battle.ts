import express from "express";
import { gamesQuery as gamesCollection } from "../index";

const router = express.Router();

// Compare pagina tonen
router.get("/battle", async (req, res) => {
  if (!req.session || !(req.session as any).user) {
    return res.redirect("/login");
  }
  res.render("battle");
});
