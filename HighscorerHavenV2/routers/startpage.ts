import express, { Router } from "express";
import { ObjectId } from "mongodb";
import { userCollection, gamesCollection } from "../database";
import { requireAuth } from "../authentication/sessionHelper";
import { game, LibraryEntry, LoggedInUser, User } from "../types";

export function startpageRouter(){
    const router = Router();

    router.get("/", requireAuth, async (req, res) => {
        try{
            const sessionUser: LoggedInUser = (req.session as any).user as LoggedInUser;
            const user: User | null = await userCollection.findOne<User>({_id: new ObjectId(sessionUser.id)});

            if(!user){
                res.redirect("/login");
                return;
            }

            const recentGames: LibraryEntry[] = user.library.reverse().slice(0,5);
            const recentGamesId: number[] = recentGames.map((entry) => entry.gameId);

            const games: game[] = await gamesCollection.find<game>({ id: { $in: recentGamesId } }).toArray();

            const gamesWithStatus = games.map((game) => ({
                ...game,
                status: recentGames.find((e) => e.gameId === game.id)?.status
            }))

            res.render("startpage",{
                user: user,
                games: gamesWithStatus
            })

        }
        catch(e){
            console.log(e);
        }
    });
    return router;
}
