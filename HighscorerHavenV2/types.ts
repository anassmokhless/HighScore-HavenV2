export interface game{
    id : number,
    slug : string,
    name : string,
    background_image : string,
    rating : number,
    rating_top: number,
   ratings : Ratings
   ratings_count : number,
   reviews_text_count : number,
   added : number,
   added_by_status : AddedByStatus,
   metacritic: number,
   playtime: number,
   suggestions_count: number,
   updated: string,
   revieuws_count:number,
   platforms : Platforms
   // parent_platforms
   // genres
   // stores
   // tags
   //esrb_rating
   //short_screenshots
   description : string,
   website: string,
   //developers
   //publishers
} 

interface Ratings{
    id: number,
    title: string,
    count : number,
    percent : number
}

interface AddedByStatus{
    yet:number,
    owned:number,
    beaten:number,
    toplay:number,
    dropped:number,
    playing:number
}
interface Platform{
    id: number,
    name:string,
    slug:string,
    year_end:number | null,
    Year_start:number | null,
    games_count: number,
    image_background: string
}
interface Requirements_en{
    minimum:string | null,
    recommended:string | null
}
interface Platforms{
    platform : Platform,
    released_at:string,
    requirements_en:Requirements_en
}