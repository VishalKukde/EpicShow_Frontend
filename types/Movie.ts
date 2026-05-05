export interface Movie {
  _id: string;
  name: string;
  description: string;
  genre: string[];
  imageUrl: string;
  language: string;
  runtimeMinutes: number;
  rating: number;
  avg_rating?: number;
  total_reviews?: number;
  releaseDate?: string; // ✅ add this
  createdAt?: string;
  updatedAt?: string;
}
