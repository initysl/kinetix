interface RulesScreenProps {
  onBack: () => void;
}

export default function RulesScreen({ onBack }: RulesScreenProps) {
  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-indigo-900'>
      <div
        id='rules-card'
        className='w-full max-w-lg bg-white text-black border-b-12 border-black border-x-4 border-t-4 rounded-[40px] p-6 sm:p-10 relative shadow-2xl'
      >
        <h1
          id='rules-title'
          className='text-4xl sm:text-5xl font-black text-center text-indigo-950 tracking-tight mb-8'
        >
          RULES
        </h1>

        <section className='mb-8' id='rules-objective-section'>
          <h2 className='text-xl font-bold text-indigo-800 mb-3 tracking-wide uppercase'>
            Objective
          </h2>
          <p className='text-slate-600 font-medium leading-relaxed'>
            Be the first player to connect{' '}
            <span className='font-bold text-black border-b-2 border-red-500 pb-0.5'>
              4 of your colored discs in a row
            </span>{' '}
            (horizontally, vertically, or diagonally).
          </p>
        </section>

        <section className='mb-10' id='rules-how-to-play-section'>
          <h2 className='text-xl font-bold text-indigo-800 mb-4 tracking-wide uppercase'>
            How to Play
          </h2>
          <ol className='space-y-4'>
            <li className='flex gap-4 items-start'>
              <span className='shrink-0 w-7 h-7 bg-indigo-900 text-white rounded-full font-bold flex items-center justify-center text-sm border-2 border-black'>
                1
              </span>
              <p className='text-slate-600 font-medium pt-0.5'>
                Red always goes first. In a Player vs AI game, Player 1 (Red)
                takes the first turn.
              </p>
            </li>
            <li className='flex gap-4 items-start'>
              <span className='shrink-0 w-7 h-7 bg-indigo-900 text-white rounded-full font-bold flex items-center justify-center text-sm border-2 border-black'>
                2
              </span>
              <p className='text-slate-600 font-medium pt-0.5'>
                Players take turns selecting columns. Dropping a disc places it
                in the lowest available slot of that column.
              </p>
            </li>
            <li className='flex gap-4 items-start'>
              <span className='shrink-0 w-7 h-7 bg-indigo-900 text-white rounded-full font-bold flex items-center justify-center text-sm border-2 border-black'>
                3
              </span>
              <p className='text-slate-600 font-medium pt-0.5'>
                The game includes a{' '}
                <span className='font-bold text-black'>
                  30-second turn limit
                </span>
                . Failing to play in time automatically forfeits the turn or
                triggers a random move!
              </p>
            </li>
            <li className='flex gap-4 items-start'>
              <span className='shrink-0 w-7 h-7 bg-indigo-900 text-white rounded-full font-bold flex items-center justify-center text-sm border-2 border-black'>
                4
              </span>
              <p className='text-slate-600 font-medium pt-0.5'>
                The game ends when a player forms a line of four, or when the
                entire board is full, resulting in a draw.
              </p>
            </li>
          </ol>
        </section>

        <div className='flex justify-center -mb-14 sm:-mb-18'>
          <button
            id='rules-confirm-btn'
            onClick={onBack}
            className='w-16 h-16 bg-red-500 hover:bg-pink-600 rounded-full border-4 border-black flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-transform'
            aria-label='Confirm and go back'
          >
            {/* SVG Checkmark */}
            <svg
              className='w-8 h-8 text-white stroke-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5 13l4 4L19 7'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
