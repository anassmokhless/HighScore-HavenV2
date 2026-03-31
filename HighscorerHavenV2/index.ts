import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { hash } from "crypto";
import bcrypt from "bcrypt";

dotenv.config();

const app: Express = express();
<<<<<<< HEAD

const uri = "mongodb+srv://havenhighscore_db_user:haven@highscorehaven.tjuwhvt.mongodb.net/?appName=Highscorehaven";
const client = new MongoClient(uri);
const gamesQuery = client.db("HighscoreHaven").collection("Games");
const usersQuery = client.db("HighscoreHaven").collection("Users");
=======
>>>>>>> a92cd19 (.)

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.render("index", {
    title: "Hello World",
    message: "Hello World",
  });
<<<<<<< HEAD
=======
});
app.get("/battle", (req, res) => {
  res.render("index", {
    title: "Hello World",
    message: "Hello World",
  });
>>>>>>> a92cd19 (.)
});
app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port"));
});
