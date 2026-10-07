import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMovie } from '@/lib/tmdb'
import CastCard from '@/app/components/cast-card'
import Snackbar from '@/app/components/snackbar'

const IMG = 'https://image.tmdb.org/t/p'

export default async function MoviePage ({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  if (!id) notFound()
  const { data: movie, error } = await getMovie(id)
  if (!movie) {
    return (
      <main className='min-h-screen bg-neutral-950 text-white'>
        <Snackbar message={error} />
      </main>
    )
  }

  const director = movie.credits.crew.find(c => c.job === 'Director')?.name
  const year = movie.release_date?.slice(0, 4)
  const hours = Math.floor(movie.runtime / 60)
  const mins = movie.runtime % 60

  return (
    <main className='min-h-screen bg-neutral-950 text-white'>
      {/* backdrop */}
      {movie.backdrop_path && (
        <div className='absolute inset-x-0 top-0 h-[480px] -z-0 opacity-30'>
          <Image
            src={`${IMG}/w1280${movie.backdrop_path}`}
            alt=''
            fill
            priority
            sizes='100vw'
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950' />
        </div>
      )}

      <div className='relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-28'>
        {' '}
        <div className='flex flex-col gap-8 md:flex-row'>
          {/* poster */}
          <div className='relative mx-auto aspect-[2/3] w-64 shrink-0 overflow-hidden rounded-xl shadow-2xl md:mx-0 md:w-80'>
            {movie.poster_path ? (
              <Image
                src={`${IMG}/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                priority
                sizes='(min-width: 768px) 320px, 256px'
                className='object-cover'
              />
            ) : (
              <div className='grid h-full place-items-center bg-neutral-800'>
                No poster
              </div>
            )}
          </div>

          {/* details */}
          <div className='flex-1'>
            <h1 className='text-3xl font-bold md:text-4xl'>
              {movie.title}{' '}
              <span className='font-normal text-neutral-400'>({year})</span>
            </h1>
            {movie.tagline && (
              <p className='mt-1 italic text-neutral-400'>{movie.tagline}</p>
            )}

            <div className='mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-300'>
              <span className='rounded bg-yellow-500 px-2 py-0.5 font-semibold text-black'>
                ★ {movie.vote_average.toFixed(1)}
              </span>
              {movie.runtime > 0 && (
                <span>
                  {hours}h {mins}m
                </span>
              )}
              {movie.spoken_languages[0] && (
                <span>
                  {movie.spoken_languages.map(l => l.english_name).join(', ')}
                </span>
              )}
              <span>{movie.release_date}</span>
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
              {movie.genres.map(g => (
                <span
                  key={g.id}
                  className='rounded-full border border-neutral-600 px-3 py-1 text-xs'
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h2 className='mt-6 text-lg font-semibold'>Overview</h2>
            <p className='mt-1 max-w-2xl text-neutral-300'>{movie.overview}</p>

            {director && (
              <p className='mt-4 text-sm text-neutral-400'>
                Director: <span className='text-white'>{director}</span>
              </p>
            )}

            <Link
              href={`/book?id=${movie.id}`}
              className='mt-8 inline-block rounded-lg bg-red-600 px-8 py-3 text-lg font-semibold transition hover:bg-red-700'
            >
              Book now
            </Link>
          </div>
        </div>
        {/* cast */}
        <section className='mt-12'>
          <h2 className='mb-4 text-2xl font-semibold'>Cast</h2>
          <div className='flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {' '}
            {movie.credits.cast.slice(0, 20).map(c => (
              <CastCard key={c.id} member={c} />
            ))}
          </div>
        </section>
      </div>

      <Snackbar message={error} />
    </main>
  )
}
