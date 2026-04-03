import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import session from "express-session";

//routers
import registerRouter from "./routers/registeren";
import loginRouter from "./routers/login";
import compareRouter from "./routers/compare";

dotenv.config();

const app: Express = express();

const uri =
  "mongodb+srv://havenhighscore_db_user:haven@highscorehaven.tjuwhvt.mongodb.net/?appName=Highscorehaven";

const client = new MongoClient(uri);
export const gamesQuery = client.db("HighscoreHaven").collection("Games");
export const usersQuery = client.db("HighscoreHaven").collection("Users");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

app.use(registerRouter);
app.use(loginRouter);
app.use(compareRouter);

app.get("/", (req, res) => {
  res.render("index", {
    title: "Hello World",
    message: "Hello World",
  });
});

app.get("/battle", (req, res) => {
  res.render("index", {
    title: "Hello World",
    message: "Hello World",
  });
});

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port"));
});

async function main() {}
