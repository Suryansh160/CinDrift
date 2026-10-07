import Image from 'next/image'
import Link from 'next/link'
import { img } from '@/lib/tmdb'
import type { Movie } from '@/lib/types'

export default function MovieCard ({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movie-details?id=${movie.id}`}
      className='group relative aspect-2/3 overflow-hidden rounded-lg bg-zinc-900 outline-none transition duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-primary'
    >
      <Image
        src={img(movie.poster_path)}
        alt={movie.title}
        fill
        sizes='(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw'
        className='object-cover transition duration-500 group-hover:scale-105'
      />
      <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent' />
      <div className='absolute inset-x-0 bottom-0 p-2.5'>
        <h3 className='truncate text-xs font-semibold'>{movie.title}</h3>
        <p className='mt-0.5 text-[11px] text-gray-300'>
          {movie.vote_average.toFixed(1)} · {movie.release_date?.slice(0, 4)} ·
          Movie
        </p>
      </div>
    </Link>
  )
}
