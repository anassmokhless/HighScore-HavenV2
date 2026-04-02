import express from "express";
import bcrypt from "bcrypt";
import { usersQuery as usersCollection } from "../index";

const router = express.Router();

router.get("/registeren", (req, res) => {
  res.render("registeren");
});

router.post("/registeren", async (req, res) => {
  const { name, famName, email, username, password, conPass, avatar } =
    req.body;

  if (!name || !famName || !email || !username || !password) {
    return res.send("Vul alle velden in");
  }

  if (password !== conPass) {
    return res.send("Wachtwoorden komen niet overeen");
  }
  // check die username of email al in gebruikt
  const existingUser = await usersCollection.findOne({ username });
  if (existingUser) {
    return res.send("Gebruikersnaam bestaat al");
  }
  const existingEmail = await usersCollection.findOne({ email });
  if (existingEmail) {
    return res.send("E-mailadres is al in gebruik");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await usersCollection.insertOne({
    name: `${name} ${famName}`,
    username,
    email,
    startDate: new Date().toLocaleDateString("nl-BE"),
    password: hashedPassword,
    avatar: avatar || "/img/profiel.png",
    library: [],
    stats: {
      guesser: { correct: 0, fout: 0, xp: 0 },
      battle: { wins: 0, losses: 0, xp: 0 },
    },
    xpHistory: [],
  });

  res.redirect("/login");
});

export default router;
