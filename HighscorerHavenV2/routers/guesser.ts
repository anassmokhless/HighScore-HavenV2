import { Router } from "express";
import { ObjectId } from "mongodb";
import { gamesCollection, userCollection } from "../database";
import { requireAuth } from "../authentication/sessionHelper";
import { game, LoggedInUser, User } from "../types";

export function guesserRouter() {
    const router = Router();

    router.get("/", requireAuth, async (req, res) => {
        try {
            const sessionUser: LoggedInUser = (req.session as any)
                .user as LoggedInUser;
            const user = await userCollection.findOne<User>({
                _id: new ObjectId(sessionUser.id),
            });

            if (!user) {
                res.redirect("login");
                return;
            }

            const [correctGame]: game[] = await gamesCollection
                .aggregate<game>([{ $sample: { size: 1 } }])
                .toArray();
            const decoys: game[] = await gamesCollection
                .aggregate<game>([{ $sample: { size: 4 } }])
                .toArray();

            const gameOptions: game[] = [correctGame, ...decoys].sort(
                () => Math.random() - 0.5,
            );

            const correct: number = user.stats.guesser.correct;
            const wrong: number = user.stats.guesser.fout;
            const total: number = correct + wrong;
            const accuracy: number =
                total > 0 ? Math.round((correct / total) * 100) : 0;

            res.render("guesser", {
                correctGame: correctGame,
                gameOptions: gameOptions,
                result: null,
                chosenGame: null,
                correct: correct,
                wrong: wrong,
                total: total,
                accuracy: accuracy,
                xp: user.stats.guesser.xp,
            });
        } catch (e) {
            console.log(e);
        }
    });

    router.post("/result", requireAuth, async (req, res) => {
        try {
            const sessionUser: LoggedInUser = (req.session as any)
                .user as LoggedInUser;
            const chosenGame: string = req.body.chosenGame;
            const correctAnswer: string = req.body.correctAnswer;

            const isCorrect: boolean = chosenGame === correctAnswer;

            if (isCorrect) {
                await userCollection.updateOne(
                    { _id: new ObjectId(sessionUser.id) },
                    {
                        $inc: { "stats.guesser.correct": 1, "stats.guesser.xp": 50 },
                        $push: {
                            xpHistory: {
                                actie: "Guesser - Correct",
                                xp: 50,
                                datum: new Date().toISOString().slice(0, 16),
                            },
                        },
                    },
                );
            } else {
                await userCollection.updateOne(
                    { _id: new ObjectId(sessionUser.id) },
                    {
                        $inc: { "stats.guesser.fout": 1 },
                    },
                );
            }

            const [user, correctGame] = await Promise.all([
                userCollection.findOne<User>({ _id: new ObjectId(sessionUser.id) }),
                gamesCollection.findOne<game>({ name: correctAnswer }),
            ]);

            if (!user) {
                res.redirect("/login");
                return;
            }

            const correct: number = user.stats.guesser.correct;
            const wrong: number = user.stats.guesser.fout;
            const total: number = correct + wrong;
            const accuracy: number =
                total > 0 ? Math.round((correct / total) * 100) : 0;

            res.render("guesser", {
                correctGame: correctGame,
                gameOptions: [],
                result: isCorrect ? "correct" : "wrong",
                chosenGame: chosenGame,
                correct: correct,
                wrong: wrong,
                total: total,
                accuracy: accuracy,
                xp: user.stats.guesser.xp,
            });
        } catch (e) {
            console.log(e);
        }
    });

    return router;
}
