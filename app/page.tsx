import HeroCarousel from '@/app/components/hero-carousel'
import MovieCard from '@/app/components/movie-card'
import Snackbar from '@/app/components/snackbar'
import { getNowPlaying, getMovie } from '@/lib/tmdb'
import { logger } from '@/lib/logger'

export default async function Home () {
  const { data, error: listError } = await getNowPlaying()
  const results = data?.results ?? []
  const top = results.filter(m => m.backdrop_path).slice(0, 5)

  const details = await Promise.all(top.map(m => getMovie(m.id)))
  const movies = details
    .map(d => d.data)
    .filter((m): m is NonNullable<typeof m> => m !== null)

  // list error takes priority, else first details error
  const error = listError ?? details.find(d => d.error)?.error ?? null

  logger.info('landing rendered', {
    slides: movies.length,
    total: results.length,
    error
  })

  return (
    <main>
      <HeroCarousel movies={movies} />

      <section id='now-showing' className='px-6 pb-20 md:px-16 lg:px-36'>
        <h2 className='mb-8 text-xl font-medium'>Now Showing</h2>
        <div className='grid grid-cols-3 gap-x-4 gap-y-10 md:grid-cols-4 lg:grid-cols-6'>
          {results.slice(0, 12).map(m => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </section>

      <Snackbar message={error} />
    </main>
  )
}
