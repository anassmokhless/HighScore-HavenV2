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
  platforms: Platform[];
  parent_platforms: PPlatform[];
  genres: Genre[];
  stores: Store[];
  tags: Tag[];
  esrb_rating: Esrb_rating;
  short_screenshots: Short_Screenshot[];
  description: string;
  website: string;
  developers: Developer[];
  publishers: Publisher[];
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
  released_at: string;
  requirements_en: Requirements_en;
}
interface Requirements_en {
  minimum: string | null;
  recommended: string | null;
}

interface PPlatform {
  id: number;
  name: string;
  slug: string;
}
interface Genre {
  id: number;
  name: string;
  slug: number;
  games_count: number;
  image_background: string;
}
interface Store {
  id: number;
  name: string;
  slug: string;
  domain: string;
  games_count: number;
  image_background: string;
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

interface Short_Screenshot {
  id: number;
  image: string;
}
interface Developer {
  id: number;
  name: string;
  slug: string;
  game_count: number;
  image_background: string;
}
interface Publisher {
  id: number;
  name: string;
  slug: string;
  game_count: number;
  image_background: string;
}