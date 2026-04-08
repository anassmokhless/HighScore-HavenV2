import { ObjectId } from "mongodb";
export interface game {
  id: number;
  slug: string;
  name: string;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings: Ratings;
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  added_by_status: AddedByStatus;
  metacritic: number;
  playtime: number;
  suggestions_count: number;
  updated: string;
  revieuws_count: number;
  platforms: Platforms;
  parent_platforms: Parent_platforms;
  genres: Gernes;
  stores: stores;
  tags: Tags;
  esrb_rating: Esrb_rating;
  short_screenshots: Short_screenshots;
  description: string;
  website: string;
  developers: Developers;
  publishers: Publishers;
}

interface Ratings {
  id: number;
  title: string;
  count: number;
  percent: number;
}

interface AddedByStatus {
  yet: number;
  owned: number;
  beaten: number;
  toplay: number;
  dropped: number;
  playing: number;
}
interface Platform {
  id: number;
  name: string;
  slug: string;
  year_end: number | null;
  Year_start: number | null;
  games_count: number;
  image_background: string;
}
interface Requirements_en {
  minimum: string | null;
  recommended: string | null;
}
interface Platforms {
  platform: Platform;
  released_at: string;
  requirements_en: Requirements_en;
}

interface Parent_platforms {
  pPlatform: PPlatform;
}
interface PPlatform {
  id: number;
  name: string;
  slug: string;
}
interface Gernes {
  gerne: Gerne;
}
interface Gerne {
  id: number;
  name: string;
  slug: number;
  games_count: number;
  image_background: string;
}
interface stores {
  id: number;
  store: Store;
}
interface Store {
  id: number;
  name: string;
  slug: string;
  domain: string;
  games_count: number;
  image_background: string;
}
interface Tags {
  tag: Tag;
}
interface Tag {
  id: number;
  name: string;
  slug: string;
  language: string;
  number_count: number;
  image_background: string;
}
interface Esrb_rating {
  id: number;
  name: string;
  slug: string;
}
interface Short_screenshots {
  screenshot: Screenshot;
}
interface Screenshot {
  id: number;
  image: string;
}
interface Developers {
  develepor: Developer;
}
interface Developer {
  id: number;
  name: string;
  slug: string;
  game_count: number;
  image_background: string;
}
interface Publishers {
  publisher: Publisher;
}
interface Publisher {
  id: number;
  name: string;
  slug: string;
  game_count: number;
  image_background: string;
}
// users
export interface User {
  name: string;
  username: string;
  email: string;
  startDate: string;
  password: string;
  avatar: string;
  library: LibraryEntry[];
  stats: UserStats;
  xpHistory: XpHistoryEntry[];
}

export interface LibraryEntry {
  gameId: number;
  status: string;
}

export interface GuesserStats {
  correct: number;
  fout: number;
  xp: number;
}

export interface BattleStats {
  wins: number;
  losses: number;
  xp: number;
}

export interface UserStats {
  guesser: GuesserStats;
  battle: BattleStats;
}

export interface XpHistoryEntry {
  actie: string;
  xp: number;
  datum: string;
}

export interface LoggedInUser {
  id: ObjectId;
  username: string;
  avatar: string;
}
