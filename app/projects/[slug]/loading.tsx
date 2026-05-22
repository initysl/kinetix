export default function LoadingProjectPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-[#161410] px-6 text-white'>
      <div className='space-y-3 text-center'>
        <div className='mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white' />
        <p className='text-sm text-white/60'>Loading showcase...</p>
      </div>
    </main>
  );
}
