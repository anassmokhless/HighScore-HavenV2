import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import session from "express-session";

// Routers
import registerRouter from "./routers/registeren";
import loginRouter from "./routers/login";
import compareRouter from "./routers/compare";
import battleRouter from "./routers/battle";

import { searchPageRouter } from "./routers/searchpage";
import { detailPageRouter } from "./routers/detail";
import { libraryRouter } from "./routers/library";
import { start } from "repl";
import session from "express-session";

//routers
import registerRouter from "./routers/registeren";
import loginRouter from "./routers/login";

dotenv.config();

const app: Express = express();

const uri =
  "mongodb+srv://havenhighscore_db_user:haven@highscorehaven.tjuwhvt.mongodb.net/?appName=Highscorehaven";

const client = new MongoClient(uri);
export const gamesQuery = client.db("HighscoreHaven").collection("Games");
export const usersQuery = client.db("HighscoreHaven").collection("Users");

const uri = "mongodb+srv://havenhighscore_db_user:haven@highscorehaven.tjuwhvt.mongodb.net/?appName=Highscorehaven";
const client = new MongoClient(uri);
export const gamesQuery = client.db("HighscoreHaven").collection("Games");
export const usersQuery = client.db("HighscoreHaven").collection("Users");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

// Routers
app.use(registerRouter);
app.use(loginRouter);
app.use(compareRouter);
app.use(battleRouter);
app.use("/searchpage", searchPageRouter());
app.use("/detail", detailPageRouter());
app.use("/library", libraryRouter());

// Pagina's
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/startpage", async (req, res) => {
  if (!(req.session as any).user) {
    return res.redirect("/login");
  }

  const sessionUser = (req.session as any).user;
  const user = await usersQuery.findOne({ _id: new ObjectId(sessionUser.id) });

  if (!user) {
    return res.redirect("/login");
  }

  res.render("startpage", { user });
});
app.get("/battle", (req, res) => {
  res.render("index", {
    title: "Hello World",
    message: "Hello World",
  });
});

app.use(
  session({
    secret: "jouw-geheime-sleutel",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 dag
  }),
);
app.use(registerRouter);
app.use(loginRouter);

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port"));
});

async function main() {}
