'use client';
import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BlogPost, StoryCard } from './types';
import BlogFeed from './ui/BlogFeed';
import PhoneFrame from './ui/PhoneFrame';
import ProfileView from './ui/ProfileView';

export default function BlogApp() {
  // Screen tracker state - 'feed' or 'profile'
  const [currentView, setCurrentView] = useState<'feed' | 'profile'>('feed');

  // High fidelity follow/following subscription check
  const [isFollowing, setIsFollowing] = useState(false);

  // High resolution photographic elements of assets from Unsplash
  const JANE_AVATAR =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

  // Reactive list of general blog posts matching the visual style in the GIF
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 'post-1',
      title: 'Holidays in old city',
      image:
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=600&auto=format&fit=crop', // tulip morning glow
      likes: 325,
      author: {
        name: 'Alise Bradley',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
      },
    },
    {
      id: 'post-2',
      title: 'The secrets of winemaking',
      image:
        'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600&auto=format&fit=crop', // grape clusters close-up
      likes: 431,
      author: {
        name: 'Merlin Sammy',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      },
    },
  ]);

  // Reactive stories array inside Jane Smith's profile deck
  const [stories, setStories] = useState<StoryCard[]>([
    {
      id: 'story-1',
      title: 'Morning in harmony',
      image:
        'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=600&auto=format&fit=crop', // breakfast donuts and tea
      likes: 325,
    },
    {
      id: 'story-2',
      title: 'Deep forest pathways',
      image:
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop', // quiet forest path
      likes: 412,
    },
    {
      id: 'story-3',
      title: 'Aesthetic cafe layouts',
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop', // coffee espresso style
      likes: 298,
    },
  ]);

  // Click handler to toggle post likes interactively
  const handleToggleLike = useCallback((postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes:
                post.likes === 325 || post.likes === 431
                  ? post.likes + 1
                  : post.likes - 1,
            }
          : post,
      ),
    );
  }, []);

  // Click handler to toggle follow state
  const handleToggleFollow = useCallback(() => {
    setIsFollowing((prev) => !prev);
  }, []);

  // Cycle stories by taking the top card and putting it at the bottom
  const handleCycleStories = useCallback(() => {
    setStories((prevStories) => {
      const [first, ...rest] = prevStories;
      return [...rest, first];
    });
  }, []);

  return (
    <div className='min-h-screen bg-linear-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-4 md:p-8 selection:bg-teal-500 selection:text-white'>
      <AnimatePresence mode='wait'>
        {currentView === 'feed' ? (
          <BlogFeed
            key='feed'
            janeAvatar={JANE_AVATAR}
            posts={posts}
            onSelectJane={() => setCurrentView('profile')}
            onToggleLike={handleToggleLike}
          />
        ) : (
          <ProfileView
            key='profile'
            janeAvatar={JANE_AVATAR}
            isFollowing={isFollowing}
            onToggleFollow={handleToggleFollow}
            onBack={() => setCurrentView('feed')}
            stories={stories}
            onCycleStories={handleCycleStories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
