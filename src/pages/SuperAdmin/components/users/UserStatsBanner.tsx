
import React from 'react';
import { Users } from 'lucide-react';

interface UserStatsBannerProps {
  totalUsers: number;
  databaseVerified: boolean;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
}

const UserStatsBanner: React.FC<UserStatsBannerProps> = ({
  totalUsers,
  databaseVerified,
  activeUsers,
  pendingUsers,
  inactiveUsers
}) => {
  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-tinder-rose/10">
          <Users size={24} className="text-tinder-rose" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Database User Verification</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">
              {databaseVerified ? 
                `Verified ${totalUsers.toLocaleString()} total registered users in database` : 
                'Verifying users in database...'}
            </p>
            {!databaseVerified && (
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-tinder-rose animate-spin"></div>
            )}
          </div>
        </div>
        <div className="ml-auto flex gap-4">
          <div className="text-center px-4 py-2 bg-white/50 rounded-md border border-gray-200">
            <p className="text-xs text-gray-500">Active Users</p>
            <p className="text-lg font-semibold text-tinder-rose">
              {activeUsers.toLocaleString()}
            </p>
          </div>
          <div className="text-center px-4 py-2 bg-white/50 rounded-md border border-gray-200">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-lg font-semibold text-amber-500">
              {pendingUsers.toLocaleString()}
            </p>
          </div>
          <div className="text-center px-4 py-2 bg-white/50 rounded-md border border-gray-200">
            <p className="text-xs text-gray-500">Inactive</p>
            <p className="text-lg font-semibold text-gray-500">
              {inactiveUsers.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsBanner;
