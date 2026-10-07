import Image from 'next/image'
import type { CastMember } from '@/lib/tmdb'

export default function CastCard ({ member }: { member: CastMember }) {
  return (
    <div className='w-28 shrink-0 snap-start text-center'>
      <div className='relative mx-auto h-28 w-28 overflow-hidden rounded-full bg-neutral-800'>
        {member.profile_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
            alt={member.name}
            fill
            sizes='112px'
            className='object-cover'
          />
        ) : (
          <div className='grid h-full place-items-center text-2xl text-neutral-500'>
            {member.name[0]}
          </div>
        )}
      </div>
      <p className='mt-2 truncate text-sm font-medium'>{member.name}</p>
      <p className='truncate text-xs text-neutral-400'>{member.character}</p>
    </div>
  )
}
