import {Router} from "express";
import {client} from "index";




export function searchPageRouter(){
const router = Router();

const respone = await let games : Game[] = await client.db("HighscoreHaven").collection("games").find<game>({}).toArray(); 








return router;
}