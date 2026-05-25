import { motion } from 'framer-motion';
import { Menu, Bell, Heart, Compass } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogFeedProps {
  onSelectJane: () => void;
  posts: BlogPost[];
  onToggleLike: (postId: string) => void;
  janeAvatar: string;
  key?: string;
}

export default function BlogFeed({
  onSelectJane,
  posts,
  onToggleLike,
  janeAvatar,
}: BlogFeedProps) {
  return (
    <div className='flex flex-col max-w-3xl mx-auto bg-slate-50'>
      {/* Top Sticky Header */}
      <div className='sticky top-0 z-10 w-full h-14 bg-white border-b border-slate-100 flex items-center justify-between px-5 select-none shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'>
        <button className='p-1 text-slate-400 hover:text-slate-600 active:scale-95 transition-transform rounded-lg hover:bg-slate-50 cursor-pointer'>
          <Menu className='w-5 h-5' strokeWidth={2.2} />
        </button>
        <h1 className='font-display font-bold text-slate-800 tracking-wider text-[15px] pl-4'>
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
        {/* Dynamic Shared-Layout Interactive Teal Bar (Jane's Profile entry point) */}
        <button
          onClick={onSelectJane}
          className='w-full h-18 rounded-2xl bg-linear-to-r from-teal-500 to-emerald-400 p-px shadow-[0_8px_16px_-4px_rgba(13,148,136,0.25)] hover:shadow-[0_12px_20px_-4px_rgba(13,148,136,0.35)] transition-all duration-300 text-left cursor-pointer group hover:scale-[1.01] active:scale-[0.99]'
        >
          {/* Inner layout connects seamlessly via layoutId */}
          <motion.div
            layoutId='profile-header-bg'
            className='w-full h-full rounded-2xl bg-linear-to-r from-[#31b3a5] to-[#40bdae] px-4 flex items-center gap-3.5 relative overflow-hidden'
          >
            {/* Ambient geometric circle shape inside collapsed header background */}
            <motion.div
              layoutId='profile-sun'
              className='absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full'
            />

            {/* Avatar Group */}
            <div className='relative z-10'>
              <motion.div
                layoutId='profile-avatar-container'
                className='w-10.5 h-10.5 rounded-full border-2 border-white overflow-hidden shadow-md'
              >
                <motion.img
                  layoutId='profile-avatar-img'
                  referrerPolicy='no-referrer'
                  src={janeAvatar}
                  alt='Jane Smith'
                  className='w-full h-full object-cover'
                />
              </motion.div>
              {/* Online pulsing indicator dot */}
              <span className='absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#31b3a5] z-10' />
            </div>

            {/* Preview labels in mini bar */}
            <div className='flex flex-col z-10'>
              <span className='text-[10px] font-bold text-white/70 tracking-widest uppercase'>
                Featured Creator
              </span>
              <span className='text-sm font-bold text-white tracking-wide'>
                Jane Smith
              </span>
            </div>

            {/* Quick Stats overview bubble */}
            <div className='ml-auto bg-white/15 backdrop-blur-md rounded-full py-1 px-3 border border-white/10 z-10 flex items-center gap-1 group-hover:bg-white/20 transition-colors'>
              <span className='text-[10px] font-bold text-white tracking-wider uppercase'>
                View
              </span>
              <Compass className='w-3.5 h-3.5 text-white/90 animate-spin-slow rotate-45' />
            </div>
          </motion.div>
        </button>

        {/* Blog Posts Feed */}
        {posts.map((post, index) => (
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

            {/* Post Metadata Card Strip */}
            <div className='p-4 flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                {/* Author Card Profile Details */}
                <div className='flex items-center gap-2.5'>
                  <img
                    referrerPolicy='no-referrer'
                    src={post.author.avatar}
                    alt={post.author.name}
                    className='w-8 h-8 rounded-full border border-slate-200/80 object-cover shadow-sm'
                  />
                  <div className='flex flex-col'>
                    <span className='text-[10px] font-bold uppercase tracking-wider text-[#ea5d71] font-display'>
                      {post.author.name}
                    </span>
                    <span className='text-[8px] font-semibold text-slate-400'>
                      2 hours ago
                    </span>
                  </div>
                </div>

                {/* Heart / Likes Toggler */}
                <button
                  onClick={() => onToggleLike(post.id)}
                  className='flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#fdf2f4] text-[#ea5d71] active:scale-90 transition-transform cursor-pointer hover:bg-[#fce5ea]'
                >
                  <Heart className='w-3.5 h-3.5 fill-current' />
                  <span className='text-xs font-bold leading-none select-none'>
                    {post.likes}
                  </span>
                </button>
              </div>

              {/* Post Title */}
              <h2 className='text-base font-semibold text-slate-800 tracking-wide font-sans mt-1 group-hover:text-teal-600 transition-colors'>
                {post.title}
              </h2>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
