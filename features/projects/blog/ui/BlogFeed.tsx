import { motion } from 'framer-motion';
import { Menu, Bell, Heart, Compass } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogFeedProps {
  onSelectJane: () => void;
  posts: BlogPost[];
  onToggleLike: (postId: string) => void;
  janeAvatar: string;
  selectedAuthorName: string;
  onSelectAuthor: (name: string) => void;
  key?: string;
}

export default function BlogFeed({
  onSelectJane,
  posts,
  onToggleLike,
  janeAvatar,
  selectedAuthorName,
  onSelectAuthor,
}: BlogFeedProps) {
  return (
    <div className='flex flex-col h-full max-w-4xl mx-auto bg-slate-50 overflow-y-auto pb-8'>
      {/* Top Sticky Header */}
      <div className='sticky top-0 z-10 w-full h-14 bg-white border-b border-slate-100 flex items-center justify-between px-5 select-none shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'>
        {/* Animated Menu Icon container with layoutId matching Profile back action */}
        <div className='relative w-8 h-8 flex items-center justify-center'>
          <motion.div
            layoutId='shared-nav-circle'
            className='absolute inset-0 bg-slate-100 rounded-full scale-0'
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
          <button className='p-1 text-slate-500 hover:text-slate-700 active:scale-95 transition-transform rounded-full cursor-pointer relative z-30'>
            <Menu className='w-5 h-5 text-slate-500' strokeWidth={2.4} />
          </button>
        </div>

        <h1 className='font-display font-black text-slate-800 tracking-widest text-[14px]'>
          BLOG
        </h1>

        <div className='flex items-center gap-2'>
          {/* Notification Button */}
          <button className='p-1 text-slate-400 hover:text-slate-600 active:scale-95 transition-transform rounded-lg hover:bg-slate-50 relative cursor-pointer'>
            <Bell className='w-5 h-5' strokeWidth={2.2} />
            <span className='absolute top-0.75 right-0.75 w-2 h-2 bg-amber-400 rounded-full border border-white ring-1 ring-amber-400/30 animate-pulse'></span>
          </button>

          {/* Logged in User Indicator */}
          <div className='w-7 h-7 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center'>
            <img
              referrerPolicy='no-referrer'
              src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
              alt='Current user'
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </div>

      {/* Main Scrollable Layout */}
      <div className='px-4 pt-4 flex flex-col gap-4'>
        {/* Blog Posts Feed */}
        {posts.map((post, index) => {
          const isPostAuthorSelected = selectedAuthorName === post.author.name;
          // Dynamically matches the background color to create deep connection with the target view's theme
          const bannerlinear =
            post.author.name === 'Alise Bradley'
              ? 'from-[#ea5d71] to-[#f472b6]'
              : 'from-[#f59e0b] to-[#ea5d71]';

          return (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 * index,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              key={post.id}
              className='w-full bg-white rounded-[24px] overflow-hidden shadow-[0_10px_25px_-8px_rgba(15,23,42,0.06)] border border-slate-100/50 flex flex-col group'
            >
              {/* Post Image Container */}
              <div className='w-full h-48 relative overflow-hidden bg-slate-100'>
                <img
                  referrerPolicy='no-referrer'
                  src={post.image}
                  alt={post.title}
                  className='w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent pointer-events-none' />

                {/* Tag Overlays */}
                <div className='absolute top-4 left-4 bg-white/85 backdrop-blur-md rounded-full py-1 px-2.5 text-[9px] font-bold text-slate-800 tracking-wider uppercase shadow-sm'>
                  Inspiration
                </div>
              </div>

              {/* Dynamic Post Metadata Card Strip morphs directly if clicked */}
              <motion.div
                layoutId={
                  isPostAuthorSelected ? 'profile-header-bg' : undefined
                }
                className={`p-4 flex flex-col gap-2 rounded-b-[24px] overflow-hidden relative transition-colors duration-300 ${isPostAuthorSelected ? `bg-linear-to-r ${bannerlinear}` : ''}`}
              >
                {/* Embedded decorative component for smooth transition background blending */}
                {isPostAuthorSelected && (
                  <motion.div
                    layoutId='profile-sun'
                    className='absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full'
                  />
                )}

                <div className='flex items-center justify-between z-10'>
                  {/* Dynamic Author Click Handle Row */}
                  <button
                    onClick={() => onSelectAuthor(post.author.name)}
                    className='flex items-center gap-2.5 cursor-pointer text-left focus:outline-none hover:opacity-90 active:scale-95 transition-all group/auth'
                  >
                    <motion.div
                      layoutId={
                        isPostAuthorSelected
                          ? 'profile-avatar-container'
                          : undefined
                      }
                      className='w-9 h-9 rounded-full border-2 border-white/80 overflow-hidden shadow-sm shrink-0 bg-slate-100'
                    >
                      <motion.img
                        layoutId={
                          isPostAuthorSelected
                            ? 'profile-avatar-img'
                            : undefined
                        }
                        referrerPolicy='no-referrer'
                        src={post.author.avatar}
                        alt={post.author.name}
                        className='w-full h-full object-cover'
                      />
                    </motion.div>

                    <div className='flex flex-col'>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider font-display transition-colors ${isPostAuthorSelected ? 'text-white' : 'text-[#ea5d71] group-hover/auth:text-teal-600'}`}
                      >
                        {post.author.name}
                      </span>
                      <span
                        className={`text-[9px] font-medium ${isPostAuthorSelected ? 'text-white/70' : 'text-slate-400'}`}
                      >
                        2 hours ago
                      </span>
                    </div>
                  </button>

                  {/* Heart / Likes Toggler */}
                  <button
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center gap-1.5 py-1 px-3 rounded-full active:scale-90 transition-transform cursor-pointer shadow-sm ${isPostAuthorSelected ? 'bg-white/20 text-white' : 'bg-[#fdf2f4] text-[#ea5d71] hover:bg-[#fce5ea]'}`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${isPostAuthorSelected ? 'fill-white' : 'fill-current'}`}
                    />
                    <span className='text-xs font-bold leading-none select-none'>
                      {post.likes}
                    </span>
                  </button>
                </div>

                {/* Post Title */}
                <h2
                  className={`text-base font-semibold tracking-wide font-sans mt-0.5 z-10 transition-colors ${isPostAuthorSelected ? 'text-white' : 'text-slate-800'}`}
                >
                  {post.title}
                </h2>
              </motion.div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
