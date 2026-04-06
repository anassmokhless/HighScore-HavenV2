import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import { MongoClient, ObjectId } from "mongodb";

// Routers
import registerRouter from "./routers/registeren";
import loginRouter from "./routers/login";
import compareRouter from "./routers/compare";
import battleRouter from "./routers/battle";

import { hash } from "crypto";
import bcrypt from "bcrypt";
import { searchPageRouter } from "./routers/searchpage";
import { detailPageRouter } from "./routers/detail";
import { libraryRouter } from "./routers/library";
import { start } from "repl";
import { User } from "./types";

dotenv.config();

const app: Express = express();

export const client = new MongoClient(process.env.MONGO_URI!);
export const gamesQuery = client.db("HighscoreHaven").collection("Games");
export const usersQuery = client.db("HighscoreHaven").collection("Users");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routers
app.get("/", (req, res) => {
  res.render("index");
});
app.use(registerRouter);
app.use(loginRouter);
app.use(compareRouter);
app.use(battleRouter);
app.use("/searchpage", searchPageRouter());
app.use("/detail", detailPageRouter());
app.use("/library", libraryRouter());
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

// Pagina's

app.get("/startpage", async (req, res) => {
  if (!(req.session as any).user) {
    return res.redirect("/login");
  }

  const sessionUser = (req.session as any).user;
  const user = await usersQuery.findOne({
    _id: new ObjectId(sessionUser.id),
  });

  if (!user) {
    return res.redirect("/login");
  }

  res.render("startpage", { user });
});
app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port"));
});

async function main() {}
