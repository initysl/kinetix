'use client';
import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BlogPost, StoryCard } from './types';
import BlogFeed from './ui/BlogFeed';
import ProfileView from './ui/ProfileView';

export interface AuthorProfile {
  name: string;
  avatar: string;
  followers: string;
  storiesCount: string;
  stories: StoryCard[];
}

export default function App() {
  // Screen tracker state - 'feed' or 'profile'
  const [currentView, setCurrentView] = useState<'feed' | 'profile'>('feed');

  // High fidelity follow/following subscription check
  const [isFollowing, setIsFollowing] = useState(false);

  // High resolution photographic elements of assets from Unsplash
  const JANE_AVATAR =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';

  // Dynamic profiles with customized story decks for high fidelity
  const [profiles, setProfiles] = useState<Record<string, AuthorProfile>>({
    'Jane Smith': {
      name: 'Jane Smith',
      avatar: JANE_AVATAR,
      followers: '325 followers',
      storiesCount: '127 stories',
      stories: [
        {
          id: 'jane-story-1',
          title: 'Morning in harmony',
          image:
            'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=600&auto=format&fit=crop', // breakfast donuts and tea
          likes: 325,
        },
        {
          id: 'jane-story-2',
          title: 'Deep forest pathways',
          image:
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop', // quiet forest path
          likes: 412,
        },
        {
          id: 'jane-story-3',
          title: 'Aesthetic cafe layouts',
          image:
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop', // coffee espresso style
          likes: 298,
        },
      ],
    },
    'Alise Bradley': {
      name: 'Alise Bradley',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
      followers: '420 followers',
      storiesCount: '84 stories',
      stories: [
        {
          id: 'alise-story-1',
          title: 'Old town secrets',
          image:
            'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=600&auto=format&fit=crop',
          likes: 325,
        },
        {
          id: 'alise-story-2',
          title: 'Vintage architecture',
          image:
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
          likes: 198,
        },
        {
          id: 'alise-story-3',
          title: 'Cozy bookshop corners',
          image:
            'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop',
          likes: 247,
        },
      ],
    },
    'Merlin Sammy': {
      name: 'Merlin Sammy',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      followers: '612 followers',
      storiesCount: '95 stories',
      stories: [
        {
          id: 'merlin-story-1',
          title: 'Grape harvest magic',
          image:
            'https://images.unsplash.com/photo-1464639351491-a172c2aa2911?q=80&w=600&auto=format&fit=crop',
          likes: 431,
        },
        {
          id: 'merlin-story-2',
          title: 'Oak barrel aging',
          image:
            'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
          likes: 288,
        },
        {
          id: 'merlin-story-3',
          title: 'Sunset wine tasting',
          image:
            'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?q=80&w=600&auto=format&fit=crop',
          likes: 310,
        },
      ],
    },
  });

  // Track currently active/selected author for the profile view
  const [selectedAuthorName, setSelectedAuthorName] =
    useState<string>('Jane Smith');

  // Get active selected profile data safely
  const activeProfile = profiles[selectedAuthorName] || profiles['Jane Smith'];

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

  // Click handler to toggle post likes interactively
  const handleToggleLike = useCallback((postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  }, []);

  // Click handler to toggle follow state
  const handleToggleFollow = useCallback(() => {
    setIsFollowing((prev) => !prev);
  }, []);

  // Cycle stories by taking the top card and putting it at the bottom
  const handleCycleStories = useCallback(() => {
    setProfiles((prev) => {
      const currentPr = prev[selectedAuthorName];
      if (!currentPr) return prev;
      const [first, ...rest] = currentPr.stories;
      return {
        ...prev,
        [selectedAuthorName]: {
          ...currentPr,
          stories: [...rest, first],
        },
      };
    });
  }, [selectedAuthorName]);

  // Navigational callback to choose a specific author
  const handleSelectAuthor = useCallback((name: string) => {
    setSelectedAuthorName(name);
    setCurrentView('profile');
  }, []);

  return (
    <div className='min-h-screen bg-linear-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-4 md:p-8 selection:bg-teal-500 selection:text-white'>
      <AnimatePresence mode='wait'>
        {currentView === 'feed' ? (
          <BlogFeed
            key='feed'
            janeAvatar={JANE_AVATAR}
            posts={posts}
            selectedAuthorName={selectedAuthorName}
            onSelectAuthor={handleSelectAuthor}
            onSelectJane={() => handleSelectAuthor('Jane Smith')}
            onToggleLike={handleToggleLike}
          />
        ) : (
          <ProfileView
            key='profile'
            selectedAuthor={activeProfile}
            isFollowing={isFollowing}
            onToggleFollow={handleToggleFollow}
            onBack={() => setCurrentView('feed')}
            stories={activeProfile.stories}
            onCycleStories={handleCycleStories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
