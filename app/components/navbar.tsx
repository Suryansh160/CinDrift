'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { login, logout } from '@/lib/actions'

const links = [
  ['Home', '/'],
  ['Movies', '/#now-showing'],
  ['Theaters', '/theaters'],
  ['Releases', '/releases']
]

export default function Navbar ({ userName }: { userName: string | null }) {
  const pathname = usePathname()
  const [section, setSection] = useState<'home' | 'movies'>('home')

  // when a new page renders (or you arrive via /#now-showing), sync from the URL
  useEffect(() => {
    setSection(window.location.hash === '#now-showing' ? 'movies' : 'home')
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' && section === 'home'
    if (href === '/#now-showing')
      return pathname === '/' && section === 'movies'
    return pathname.startsWith(href)
  }

  // on the home page, scroll manually and switch the highlight
  const handleClick = (e: React.MouseEvent, href: string) => {
    if (pathname !== '/') return
    if (href === '/') {
      e.preventDefault()
      setSection('home')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.replaceState(null, '', '/')
    } else if (href === '/#now-showing') {
      e.preventDefault()
      setSection('movies')
      document
        .getElementById('now-showing')
        ?.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', '/#now-showing')
    }
  }

  return (
    <header className='fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-16 lg:px-36'>
      <Link
        href='/'
        onClick={e => handleClick(e, '/')}
        className='text-3xl font-semibold outline-none'
      >
        <span className='text-primary'>Cin</span>Drift
      </Link>

      <nav className='hidden items-center gap-2 rounded-full bg-white/10 p-1.5 backdrop-blur md:flex'>
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            onClick={e => handleClick(e, href)}
            className={`rounded-full px-5 py-2 text-sm uppercase tracking-widest outline-none transition ${
              isActive(href)
                ? 'bg-white text-primary'
                : 'text-white hover:bg-white/15'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className='flex items-center gap-6'>
        <Search className='size-6 cursor-pointer' />

        {userName ? (
          <form action={logout} className='flex items-center gap-4'>
            <span className='text-sm'>{userName}</span>
            <button className='rounded-full bg-primary px-7 py-2 font-medium outline-none transition hover:opacity-90'>
              Logout
            </button>
          </form>
        ) : (
          <form action={login}>
            <button className='rounded-full bg-primary px-7 py-2 font-medium outline-none transition hover:opacity-90'>
              Login
            </button>
          </form>
        )}
      </div>
    </header>
  )
}
