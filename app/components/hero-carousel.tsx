'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import type { Movie } from '@/lib/types'

const INTERVAL = 10000

const bg = (p: string | null) =>
  p ? `https://image.tmdb.org/t/p/w1280${p}` : '/no-poster.png'

const fmtRuntime = (m?: number) =>
  m ? `${Math.floor(m / 60)}h ${m % 60}m` : null

export default function HeroCarousel ({ movies }: { movies: Movie[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || movies.length < 2) return
    const t = setTimeout(
      () => setActive(i => (i + 1) % movies.length),
      INTERVAL
    )
    return () => clearTimeout(t)
  }, [active, paused, movies.length])

  const movie = movies[active]
  const year = movie.release_date?.slice(0, 4)
  const runtime = fmtRuntime(movie.runtime)

  return (
    <section
      className='relative h-screen overflow-hidden'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* crossfading backgrounds */}
      {movies.map((m, i) => (
        <div
          key={m.id}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={bg(m.backdrop_path)}
            alt={m.title}
            fill
            priority={i === 0}
            sizes='100vw'
            className={`object-cover ${i === active ? 'hero-zoom' : ''}`}
          />
        </div>
      ))}

      <div className='absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-transparent' />
      <div className='absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#09090b] to-transparent' />

      {/* content: key remounts it so the entrance animation replays per slide */}
      <div
        key={movie.id}
        className='relative z-10 flex h-full flex-col justify-center px-6 md:px-16 lg:px-36'
      >
        <div className='flex max-w-xl flex-col gap-4'>
          {movie.tagline && (
            <p
              className='hero-in text-sm font-medium uppercase tracking-widest text-primary'
              style={{ animationDelay: '0.1s' }}
            >
              {movie.tagline}
            </p>
          )}

          <h1
            className='hero-in text-5xl font-semibold leading-tight md:text-7xl'
            style={{ animationDelay: '0.2s' }}
          >
            {movie.title}
          </h1>

          <div
            className='hero-in flex flex-wrap items-center gap-4 text-gray-300'
            style={{ animationDelay: '0.35s' }}
          >
            <span>
              {movie.genres
                ?.slice(0, 3)
                .map(g => g.name)
                .join(' | ')}
            </span>
            {year && (
              <span className='flex items-center gap-1.5'>
                <CalendarDays className='size-4' /> {year}
              </span>
            )}
            {runtime && (
              <span className='flex items-center gap-1.5'>
                <Clock className='size-4' /> {runtime}
              </span>
            )}
          </div>

          <p
            className='hero-in line-clamp-3 max-w-md text-gray-300'
            style={{ animationDelay: '0.5s' }}
          >
            {movie.overview}
          </p>

          <Link
            href={`/book/${movie.id}`}
            className='hero-in mt-2 flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium transition hover:opacity-90'
            style={{ animationDelay: '0.65s' }}
          >
            Book Now <ArrowRight className='size-4' />
          </Link>
        </div>
      </div>

      {/* dots */}
      <div className='absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5'>
        {movies.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setActive(i)}
            aria-label={`Show ${m.title}`}
            className={`h-2.5 cursor-pointer rounded-full transition-all duration-500 ${
              i === active
                ? 'w-8 bg-primary'
                : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
