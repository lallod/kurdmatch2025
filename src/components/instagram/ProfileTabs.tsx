import React, { useState } from 'react';
import { Grid3x3, Heart, Image as ImageIcon, User } from 'lucide-react';
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

  const tabs: { id: TabType; icon: React.ElementType; label: string }[] = [
    { id: 'posts', icon: Grid3x3, label: 'Posts' },
    { id: 'photos', icon: ImageIcon, label: 'Photos' },
    { id: 'about', icon: User, label: 'About' },
  ];

  return (
    <div>
      {/* Instagram-style icon tabs — full width, border indicator */}
      <div className="flex border-b border-border/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all relative ${
              activeTab === tab.id
                ? 'text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content — edge to edge */}
      <div className="min-h-[40vh]">
        {activeTab === 'posts' && (
          <PostsGrid posts={posts} onRefresh={onRefreshPosts} />
        )}
        {activeTab === 'photos' && (
          <ProfilePhotos profile={profile} />
        )}
        {activeTab === 'about' && (
          <div className="px-4 pt-3">
            <ProfileAbout profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
