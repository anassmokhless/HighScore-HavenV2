import express from "express";
import bcrypt from "bcrypt";
import { usersQuery as usersCollection } from "../index";

const router = express.Router();

// Login pagina tonen
router.get("/login", (req, res) => {
  res.render("login");
});

// Login form verwerken
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect("/login?error=Vul+alle+velden+in");
  }

  const user = await usersCollection.findOne({ username });
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

export default router;
