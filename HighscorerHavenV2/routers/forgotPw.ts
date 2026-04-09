import { Router } from "express";
import { userCollection } from "../database";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { User } from "../types";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export function forgotPwRouter() {
  const router = Router();

  router.get("/", (req, res) => {
    res.render("forgotPw", {
      error: null,
      success: null,
    });
  });

  router.post("/", async (req, res) => {
    try {
      const email: string = req.body.email;
      const user: User | null = await userCollection.findOne({ email: email });

      if (!user) {
        res.render("forgotPw", {
          error: "Geen account gevonden met dit emailadres.",
          success: null,
        });
        return;
      }

      const token: string = crypto.randomBytes(32).toString("hex");
      const expiry: string = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      await userCollection.updateOne({email: email},{$set: {resetToken: token, resetTokenExpiry: expiry}});

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Wachtwoord herstellen - HighScore Haven",
        html:`
        <p>Klik op de link om je wachtwoord te herstellen:</p>
        <a href="${process.env.BASE_URL}/resetPw?token=${token}">Wachtwoord herstellen</a>
         <p>Deze link is 1 uur geldig.</p>
        `});
      
     res.render("forgotPw", {
                error: null,
                success: "Er is een herstelmail verstuurd naar je emailadres."
            }); 
    } catch (e) {
        console.log(e);
    }
  });

  return router;
}
