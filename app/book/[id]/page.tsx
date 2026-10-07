import MovieDetailsPage from '@/app/movie-details/page'

export default async function BookPage ({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <MovieDetailsPage searchParams={Promise.resolve({ id })} />
}
