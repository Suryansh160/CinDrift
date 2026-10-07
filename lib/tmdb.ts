import { logger } from '@/lib/logger'
import type { Movie } from '@/lib/types'

const BASE = 'https://api.themoviedb.org/3'
const headers = { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }

export type Result<T> = { data: T | null; error: string | null }

export type CastMember = {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export type MovieDetails = {
  id: number
  title: string
  tagline: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number
  vote_average: number
  genres: { id: number; name: string }[]
  spoken_languages: { english_name: string }[]
  credits: { cast: CastMember[]; crew: { job: string; name: string }[] }
}

async function tmdb<T> (path: string, label: string): Promise<Result<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers,
      next: { revalidate: 3600 }
    })
    if (!res.ok) {
      logger.error(`TMDB ${label} failed: ${res.status}`)
      return { data: null, error: `Couldn't load ${label} (${res.status})` }
    }
    return { data: (await res.json()) as T, error: null }
  } catch (err) {
    logger.error(`TMDB ${label} network error: ${(err as Error).message}`)
    return { data: null, error: 'Network error. Please try again.' }
  }
}

export function getMovie (id: number | string) {
  return tmdb<MovieDetails>(
    `/movie/${id}?append_to_response=credits`,
    `movie ${id}`
  )
}

export function getNowPlaying () {
  return tmdb<{ results: Movie[] }>(
    '/movie/now_playing?region=IN',
    'now playing movies'
  )
}

export function img (path: string | null, size = 'w500') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/no-poster.png'
}
