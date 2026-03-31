import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { searchPageRouter } from "./routers/searchpage";
import { detailPageRouter } from "./routers/detail";
import { libraryRouter } from "./routers/library";
import { start } from "repl";
import session from "express-session";

//routers
import registerRouter from "./routers/registeren";
import loginRouter from "./routers/login";
import { hash } from "crypto";
import bcrypt from "bcrypt";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.use("/searchpage", searchPageRouter());
app.use("/detail", detailPageRouter());
app.use("/library", libraryRouter());

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

});

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port"));
});

async function main(){
    
}

}
