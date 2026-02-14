import React, { useState } from 'react';
import { Grid3x3, User, Image as ImageIcon } from 'lucide-react';
import { Profile } from '@/api/profiles';
import { Post } from '@/api/posts';
import PostsGrid from './PostsGrid';
import ProfileAbout from './ProfileAbout';
import ProfilePhotos from './ProfilePhotos';

interface ProfileTabsProps {
  profile: Profile;
  posts: Post[];
  onRefreshPosts: () => void;
}

type TabType = 'posts' | 'about' | 'photos';

const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile, posts, onRefreshPosts }) => {
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  const tabs = [
    { id: 'posts' as TabType, label: 'Posts', icon: Grid3x3 },
    { id: 'about' as TabType, label: 'About', icon: User },
    { id: 'photos' as TabType, label: 'Photos', icon: ImageIcon },
  ];

  return (
    <div>
      {/* Pill-style tabs */}
      <div className="bg-muted/50 rounded-xl p-1 flex mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'posts' && (
          <PostsGrid posts={posts} onRefresh={onRefreshPosts} />
        )}
        {activeTab === 'about' && (
          <ProfileAbout profile={profile} />
        )}
        {activeTab === 'photos' && (
          <ProfilePhotos profile={profile} />
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
