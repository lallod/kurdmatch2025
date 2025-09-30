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
      {/* Tabs */}
      <div className="border-t border-white/10">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-t-2 border-pink-400'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
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
