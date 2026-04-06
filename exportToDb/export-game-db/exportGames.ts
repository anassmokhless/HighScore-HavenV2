import fs from 'fs';
import { connectDB } from './database';
import { game } from './types';
import dotenv from 'dotenv';

dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);

async function exportGames() {
  const raw = fs.readFileSync('./games.json', 'utf-8');
  const games: Omit<game, 'tba'>[] = JSON.parse(raw).map(({ tba, ...rest }: any) => rest);

  const db = await connectDB();
  const collection = db.collection<Omit<game, 'tba'>>('games');

  await collection.deleteMany({});
  console.log('Cleared existing data ✓');

  const result = await collection.insertMany(games);
  console.log(`Inserted ${result.insertedCount} games into MongoDB Atlas ✓`);
  process.exit(0);
}

exportGames().catch(console.error);


// als je een nieuwe games wilt toevoegen gebruik je npx ts-node exportGames.ts  let op dit verwijderd de volledige database dus best is gwn de huidige games.json aan te vullen :D