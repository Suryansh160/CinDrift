'use client'
import { useEffect, useState } from 'react'

export default function Snackbar ({ message }: { message: string | null }) {
  const [open, setOpen] = useState(!!message)

  useEffect(() => {
    setOpen(!!message)
    if (!message) return
    const t = setTimeout(() => setOpen(false), 5000)
    return () => clearTimeout(t)
  }, [message])

  if (!open || !message) return null

  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-md bg-red-600 px-4 py-3 text-white shadow-lg'>
      <span>{message}</span>
      <button onClick={() => setOpen(false)} aria-label='Close'>
        ✕
      </button>
    </div>
  )
}
