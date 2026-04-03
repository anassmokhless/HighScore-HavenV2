import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import session from "express-session";

// Routers
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
<<<<<<< HEAD
=======

const uri =
  "mongodb+srv://havenhighscore_db_user:haven@highscorehaven.tjuwhvt.mongodb.net/?appName=Highscorehaven";
<<<<<<< HEAD

>>>>>>> 74a50ab (compair not done)
const client = new MongoClient(uri);
const gamesQuery = client.db("highscorehaven").collection("games");
const usersQuery = client.db("highscorehaven").collection("users");
>>>>>>> 18b96e3 (login en registeren (express-session enbcrypt))
=======

=======
>>>>>>> 0fce08b (sessionUser)
const client = new MongoClient(uri);
export const gamesQuery = client.db("HighscoreHaven").collection("Games");
export const usersQuery = client.db("HighscoreHaven").collection("Users");
>>>>>>> 3dfcda9 (update session en compair)

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

<<<<<<< HEAD
<<<<<<< HEAD
app.use("/searchpage", searchPageRouter());
app.use("/detail", detailPageRouter());
app.use("/library", libraryRouter());
=======
=======
>>>>>>> 3dfcda9 (update session en compair)
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
<<<<<<< HEAD
>>>>>>> 74a50ab (compair not done)
=======
>>>>>>> 3dfcda9 (update session en compair)

// Pagina's
app.get("/login", (req, res) => {
  res.render("login");
});

<<<<<<< HEAD
app.get("/battle", (req, res) => {
  res.render("index", {
    title: "Hello World",
    message: "Hello World",
  });
<<<<<<< HEAD
=======
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
>>>>>>> 0fce08b (sessionUser)
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
  console.log(
    "Server started on http://localhost:" + app.get("port") + "/login",
  );
});
<<<<<<< HEAD

<<<<<<< HEAD
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
=======
async function main() {}
>>>>>>> 3dfcda9 (update session en compair)
=======
>>>>>>> 0fce08b (sessionUser)
