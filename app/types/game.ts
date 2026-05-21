// Game Tiplerini Oluşturma

export interface Genre {
  id: number;
  name: string;
}

export interface Platform {
  id: number;
  name: string;
  slug: string;
}

export interface Game {
  id: number;
  name: string;
  rating: number;
  background_image: string;
  genres: Genre[];
  platforms: { platform: Platform }[];
  description_raw?: string;
  released?: string; // bunu ekle
}
