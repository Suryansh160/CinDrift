import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '@/app/components/navbar'
import { auth } from '@/lib/auth'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'CinDrift',
  description: 'Book movie tickets'
}

export default async function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang='en'>
      <body className={`${outfit.className} text-white antialiased`}>
        <Navbar userName={session?.user?.name ?? null} />
        {children}
      </body>
    </html>
  )
}
