export interface Movie {
  id: number
  title: string
  overview: string
  tagline?: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genres?: { id: number; name: string }[]
  runtime?: number
}
