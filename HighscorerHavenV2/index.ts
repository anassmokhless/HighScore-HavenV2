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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> 4b38ea3 (.)

const uri =
  "mongodb+srv://havenhighscore_db_user:haven@highscorehaven.tjuwhvt.mongodb.net/?appName=Highscorehaven";
=======

const uri =
  "mongodb+srv://havenhighscore_db_user:haven@highscorehaven.tjuwhvt.mongodb.net/?appName=Highscorehaven";

>>>>>>> 74a50ab (compair not done)
const client = new MongoClient(uri);
const gamesQuery = client.db("highscorehaven").collection("games");
const usersQuery = client.db("highscorehaven").collection("users");
>>>>>>> 18b96e3 (login en registeren (express-session enbcrypt))

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

<<<<<<< HEAD
app.use("/searchpage", searchPageRouter());
app.use("/detail", detailPageRouter());
app.use("/library", libraryRouter());
=======
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
>>>>>>> 74a50ab (compair not done)

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
<<<<<<< HEAD
});
<<<<<<< HEAD
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
=======
>>>>>>> 18b96e3 (login en registeren (express-session enbcrypt))

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port"));
});

});

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port"));
=======
});

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port"));
>>>>>>> 74a50ab (compair not done)
});

async function main(){
    
}

}
