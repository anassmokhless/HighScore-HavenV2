import { Router } from "express";
import { userCollection } from "../database";
import { hashPassword } from "../authentication/authService";
import { User } from "../types";

export function resetPwRouter() {
    const router = Router();

    router.get("/", async (req, res) => {
        try {
            const token: string = typeof req.query.token === "string" ? req.query.token : "";

            if (!token) {
                res.render("resetPw", {
                    error: "Ongeldige reset link.",
                    success: null,
                    token: null
                });
                return;
            }

            const user: User | null = await userCollection.findOne<User>({ resetToken: token });

            if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
                res.render("resetPw", {
                    error: "Deze reset link is ongeldig of verlopen.",
                    success: null,
                    token: null
                });
                return;
            }

            res.render("resetPw", {
                error: null,
                success: null,
                token: token
            });
        } catch (e) {
            console.log(e);
        }
    });

    router.post("/", async (req, res) => {
        try {
            const token: string = req.body.token;
            const newPw: string = req.body.newPw;
            const repeatPw: string = req.body.repeatPw;

            if (newPw !== repeatPw) {
                res.render("resetPw", {
                    error: "Wachtwoorden komen niet overeen.",
                    success: null,
                    token: token
                });
                return;
            }

            const user: User | null = await userCollection.findOne<User>({ resetToken: token });

            if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
                res.render("resetPw", { error: "Deze reset link is ongeldig of verlopen.", success: null, token: null });
                return;
            }

            await userCollection.updateOne(
                { resetToken: token },
                {
                    $set: { password: await hashPassword(newPw) },
                    $unset: { resetToken: "", resetTokenExpiry: "" }
                }
            );

            res.render("resetPw", { error: null, success: "Wachtwoord succesvol gewijzigd. Je kan nu inloggen.", token: null });
        } catch (e) {
            console.log(e);
        }
    });

    return router;
}
