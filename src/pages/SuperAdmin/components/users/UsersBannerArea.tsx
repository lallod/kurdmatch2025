
import React from 'react';
import { AIBanner } from '../payments/AIBanner';
import UserStatsBanner from './UserStatsBanner';

interface UsersBannerAreaProps {
  totalUsers: number;
  databaseVerified: boolean;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
}

const UsersBannerArea: React.FC<UsersBannerAreaProps> = ({
  totalUsers,
  databaseVerified,
  activeUsers,
  pendingUsers,
  inactiveUsers
}) => {
  return (
    <>
      <AIBanner type="user" collapsible={true} />
      
      <UserStatsBanner 
        totalUsers={totalUsers}
        databaseVerified={databaseVerified}
        activeUsers={activeUsers}
        pendingUsers={pendingUsers}
        inactiveUsers={inactiveUsers}
      />
    </>
  );
};

export default UsersBannerArea;
