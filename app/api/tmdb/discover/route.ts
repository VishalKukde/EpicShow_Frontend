import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const getBearerToken = () =>
  process.env.TMDB_BEARER_TOKEN || process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN;

const mapLanguageToLocale = (lang: string) => {
  if (lang === "hi") return "hi-IN";
  if (lang === "ta") return "ta-IN";
  return "en-US";
};

const parseRuntimeMinutes = (value: unknown) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const match = value.match(/\d+/);
    if (match) return Number(match[0]);
  }
  return null;
};

export async function GET(req: Request) {
  const token = getBearerToken();
  if (!token) {
    return NextResponse.json(
      { message: "TMDB bearer token is not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const lang = (searchParams.get("lang") || "en").toLowerCase();
  const page = searchParams.get("page") || "1";
  const recentDaysRaw = searchParams.get("recentDays") || "180";
  const recentDays = Math.min(Math.max(Number(recentDaysRaw) || 180, 1), 365);
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - recentDays);
  const todayStr = today.toISOString().split("T")[0];
  const pastStr = pastDate.toISOString().split("T")[0];

  const textLanguage = lang === "hi" ? "en-US" : mapLanguageToLocale(lang);

  const discoverUrl = new URL(`${TMDB_BASE}/discover/movie`);
  discoverUrl.searchParams.set("include_adult", "false");
  discoverUrl.searchParams.set("include_video", "false");
  discoverUrl.searchParams.set("sort_by", "popularity.desc");
  discoverUrl.searchParams.set("page", page);
  discoverUrl.searchParams.set("language", textLanguage);
  discoverUrl.searchParams.set("primary_release_date.gte", pastStr);
  discoverUrl.searchParams.set("primary_release_date.lte", todayStr);
  if (lang !== "all") {
    discoverUrl.searchParams.set("with_original_language", lang);
  }

  const genreUrl = new URL(`${TMDB_BASE}/genre/movie/list`);
  genreUrl.searchParams.set("language", "en-US");

  const headers = {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };

  try {
    const [discoverRes, genreRes] = await Promise.all([
      fetch(discoverUrl.toString(), { headers }),
      fetch(genreUrl.toString(), { headers }),
    ]);

    if (!discoverRes.ok) {
      const error = await discoverRes.text();
      return NextResponse.json(
        { message: "Failed to fetch TMDB movies", detail: error },
        { status: discoverRes.status }
      );
    }

    const discoverData = await discoverRes.json();
    const genreData = genreRes.ok ? await genreRes.json() : { genres: [] };
    const genreMap = new Map<number, string>(
      (genreData.genres || []).map((g: { id: number; name: string }) => [g.id, g.name])
    );

    const results = discoverData.results || [];
    const detailItems = await Promise.all(
      results.map(async (movie: any) => {
        if (!movie?.id) return null;
        try {
          const detailUrl = new URL(`${TMDB_BASE}/movie/${movie.id}`);
          detailUrl.searchParams.set("language", textLanguage);
          const detailRes = await fetch(detailUrl.toString(), { headers });
          if (!detailRes.ok) return null;
          const detail = await detailRes.json();
          return { id: movie.id, runtime: detail?.runtime ?? null };
        } catch {
          return null;
        }
      })
    );

    const runtimeMap = new Map<number, number | null>();
    detailItems.forEach((item) => {
      if (item && typeof item.id === "number") {
        runtimeMap.set(item.id, item.runtime ?? null);
      }
    });

    const items = results.map((movie: any) => {
      const genres = Array.isArray(movie.genre_ids)
        ? movie.genre_ids.map((id: number) => genreMap.get(id)).filter(Boolean)
        : [];

      return {
        name: movie.title || movie.original_title || "Untitled",
        description: movie.overview || "No description available.",
        genre: genres,
        imageUrl: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null,
        language: (movie.original_language || lang || "en").toUpperCase(),
        runtimeMinutes: parseRuntimeMinutes(runtimeMap.get(movie.id)),
        rating: typeof movie.vote_average === "number"
          ? Number(movie.vote_average.toFixed(1))
          : null,
        tmdbId: movie.id,
        releaseDate: movie.release_date || null,
      };
    });

    return NextResponse.json({
      items,
      page: discoverData.page,
      totalPages: discoverData.total_pages,
      totalResults: discoverData.total_results,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Unexpected error while fetching TMDB movies" },
      { status: 500 }
    );
  }
}
