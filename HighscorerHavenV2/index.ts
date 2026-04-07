import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import { MongoClient, ObjectId } from "mongodb";
import { initialisation } from "./database";

// Routers
import { registerRouter } from "./routers/registeren";
import { loginRouter } from "./routers/login";
import { compareRouter } from "./routers/compare";
import { battleRouter } from "./routers/battle";
import { searchPageRouter } from "./routers/searchpage";
import { detailPageRouter } from "./routers/detail";
import { libraryRouter } from "./routers/library";

import { hash } from "crypto";
import bcrypt from "bcrypt";
import { start } from "repl";
import { User } from "./types";

dotenv.config();

const app: Express = express();

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
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/registeren", registerRouter());
app.use("/login", loginRouter());
app.use("/compare", compareRouter());
app.use("/battle", battleRouter());
app.use("/searchpage", searchPageRouter());
app.use("/detail", detailPageRouter());
app.use("/library", libraryRouter());

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port"));
});

initialisation();
