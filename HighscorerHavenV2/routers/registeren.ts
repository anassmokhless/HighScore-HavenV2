import express from "express";
import bcrypt from "bcrypt";
import { usersQuery as usersCollection } from "../index";

export function registerRouter() {
  const router = express.Router();
  router.get("/", (req, res) => {
    res.render("registeren");
  });

  router.post("/", async (req, res) => {
    const { name, famName, email, username, password, conPass, avatar } =
      req.body;
    if (!name || !famName || !email || !username || !password) {
      return res.send("Vul alle velden in");
    }

    // check errors 1: cant find user 2: cant find mail 3:pw<6 4:niet overeen
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.redirect("/registeren?error=1");
    }
    const existingEmail = await usersCollection.findOne({ email });
    if (existingEmail) {
      return res.redirect("/registeren?error=2");
    }
    if (password.length < 6) {
      return res.redirect("/registeren?error=3");
    }
    if (password !== conPass) {
      return res.redirect("/registeren?error=4");
    }

    //hash pw
    const hashedPassword = await bcrypt.hash(password, 12);

    //Naar mongodb sturen
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
  return router;
}
