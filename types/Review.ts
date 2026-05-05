export interface ReviewUser {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  movie_id: string;
  booking_id: string;
  rating: number;
  comment: string;
  created_at: string;
  verified_booking?: boolean;
  user: ReviewUser;
}

export interface UserReviewMovie {
  _id: string;
  name: string;
  imageUrl?: string | null;
  language?: string;
  genre?: string[];
  runtimeMinutes?: number;
  avg_rating?: number;
  total_reviews?: number;
}

export interface UserReviewBooking {
  _id: string;
  cinemaId?: string;
  date?: string;
  slot?: string;
  seatIds?: string[];
  amount?: number;
  status?: string;
  showType?: string;
  createdAt?: string;
}

export interface UserReview extends Omit<Review, "user"> {
  movie: UserReviewMovie;
  booking: UserReviewBooking;
}

export interface ReviewSummary {
  avg_rating: number;
  total_reviews: number;
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ReviewListResponse {
  success: boolean;
  data: Review[];
  pagination: ReviewPagination;
  summary: ReviewSummary;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data: {
    review: Review;
    movie: ReviewSummary;
  };
}

export interface UserReviewListResponse {
  success: boolean;
  data: UserReview[];
  pagination: ReviewPagination;
  summary: {
    total_reviews: number;
  };
}
