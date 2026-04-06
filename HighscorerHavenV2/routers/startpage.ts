import express from "express";
import { ObjectId } from "mongodb";
import { usersQuery as usersCollection } from "../index";

export function startpageRouter() {
  const router = express.Router();

  router.get("/startpage", async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const user = await usersCollection.findOne({
      _id: new ObjectId(req.session.user.id),
    });

    if (!user) {
      return res.redirect("/login");
    }

    res.render("startpage", { user });
  });

  return router; // ✅ must return the router
}
