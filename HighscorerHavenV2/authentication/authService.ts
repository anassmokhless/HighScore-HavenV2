import bcrypt from "bcrypt";
import { userCollection } from "../database";
import { LogedInUser } from "../types";

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, 12);
}

export async function findAndValidateUser(username: string, password: string,): Promise<LogedInUser | null> {
    const user = await userCollection.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) 
    {
        return user;
    } 
    else {
        return null;
    }
}
