import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-[#f3efe7] px-6 text-[#161410]'>
      <div className='max-w-md rounded-[2rem] border border-black/8 bg-white p-8 text-center shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)]'>
        <p className='text-sm font-medium text-black/50'>404</p>
        <h1 className='mt-2 text-3xl font-semibold tracking-tight'>
          Project not found
        </h1>
        <p className='mt-3 text-sm leading-6 text-black/65'>
          This showcase route does not exist in the current collection.
        </p>
        <Link
          href='/'
          className='mt-6 inline-flex items-center rounded-full bg-[#161410] px-4 py-2 text-sm font-medium text-white transition hover:bg-black'
        >
          Return to gallery
        </Link>
      </div>
    </main>
  );
}
