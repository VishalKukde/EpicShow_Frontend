export interface Movie {
  _id: string;
  name: string;
  description: string;
  genre: string[];
  imageUrl: string;
  language: string;
  runtimeMinutes: number;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}
