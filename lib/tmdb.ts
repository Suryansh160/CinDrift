import type { Movie, MovieList } from "./types";
import { logger } from "./logger";

const BASE = "https://api.themoviedb.org/3";
const headers = { Authorization: `Bearer ${process.env.TMDB_API_KEY}` };

async function tmdb<T>(path: string): Promise<T> {
  const start = Date.now();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { headers, next: { revalidate: 3600 } });
  } catch (err) {
    const e = err as Error & { cause?: { code?: string } };
    logger.error("TMDB network error", { path, message: e.message, code: e.cause?.code });
    throw err;
  }
  if (!res.ok) {
    logger.error("TMDB request failed", { path, status: res.status, body: await res.text() });
    throw new Error(`TMDB failed ${res.status}`);
  }
  logger.debug("TMDB ok", { path, ms: Date.now() - start });
  return res.json();
}

export const getNowPlaying = (page = 1) =>
  tmdb<MovieList>(`/movie/now_playing?region=IN&page=${page}`);

export const getMovie = (id: string | number) => tmdb<Movie>(`/movie/${id}`);

export const img = (path: string | null, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/no-poster.png";