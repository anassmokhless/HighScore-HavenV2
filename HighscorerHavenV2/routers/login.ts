import express from "express";
import bcrypt from "bcrypt";
import { userCollection } from "../database";

export function loginRouter() {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.render("login");
  });

  // Login form verwerken
  router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.redirect("/login?error=Vul+alle+velden+in");
    }

    const user = await userCollection.findOne({ username });
    if (!user) return res.redirect("/login?error=true");

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) return res.redirect("/login?error=true");

    // Sessie aanmaken
    (req.session as any).user = {
      id: user._id,
      username: user.username,
      avatar: user.avatar,
    };

    res.redirect("/startpage");
  });
  return router;
}
