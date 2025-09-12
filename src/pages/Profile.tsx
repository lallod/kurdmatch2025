import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Profile as ProfileType } from '@/types/swipe';
import BottomNavigation from '@/components/BottomNavigation';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state?.profile as ProfileType;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="text-purple-300 hover:text-white"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-semibold text-white">Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        {/* Profile Photo */}
        <div className="aspect-square rounded-2xl overflow-hidden mb-6">
          <img
            src={profile.avatar || profile.photos?.[0] || '/placeholder.svg'}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Basic Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <span className="text-xl text-white/80">{profile.age}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/90 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>{profile.location}</span>
            <span className="text-white/70">•</span>
            <span>{profile.distance}km away</span>
          </div>

          {profile.bio && (
            <p className="text-white/90 text-sm leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-4">
            <h3 className="text-lg font-semibold text-white mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">About</h3>
          <div className="space-y-2 text-white/90 text-sm">
            {profile.occupation && (
              <div><span className="text-white/70">Work:</span> {profile.occupation}</div>
            )}
            {profile.education && (
              <div><span className="text-white/70">Education:</span> {profile.education}</div>
            )}
            {profile.height && (
              <div><span className="text-white/70">Height:</span> {profile.height}</div>
            )}
            {profile.relationshipGoals && (
              <div><span className="text-white/70">Looking for:</span> {profile.relationshipGoals}</div>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;