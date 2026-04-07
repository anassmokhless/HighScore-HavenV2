import { MongoClient } from "mongodb";
import { User, game } from "./types";

export const client = new MongoClient(process.env.MONGO_URI!);
export const userCollection = client.db("HighscoreHaven").collection<User>("Users");
export const gamesCollection = client.db("HighscoreHaven").collection<game>("games");

export async function initialisation(){
    let connection: boolean = false;
    try {
        await client.connect();
        console.log("connected to database");
        process.on('SIGINT', closeConnection);
        connection = true;
    }
    catch (e) {
        console.log(e);
    }
}

export async function closeConnection(): Promise<void>{
    try{
        await client.close();
        console.log("disconnected from database");
        process.exit(0);
    }catch(e){
        console.log(e);
    }
}