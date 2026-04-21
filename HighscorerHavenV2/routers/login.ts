import express from "express";
import bcrypt from "bcrypt";
import { userCollection } from "../database";
import { createUserSession } from "../authentication/sessionHelper";

export function loginRouter() {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.render("login");
  });

  router.post("/", async (req, res) => {
    const { username, password } = req.body;

    const user = await userCollection.findOne({ username });
    if (!user) return res.redirect("/login?error=true");

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) return res.redirect("/login?error=true");

    createUserSession(req, {
      id: user._id,
      username: user.username,
      avatar: user.avatar,
    });

    res.redirect("/startpage");
  });
  return router;
}
