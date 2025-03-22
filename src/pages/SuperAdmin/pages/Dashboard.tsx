
import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsOverview from '../components/dashboard/StatsOverview';
import ActivityTabs from '../components/dashboard/ActivityTabs';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data reload
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        refreshing={refreshing}
        handleRefresh={handleRefresh}
      />

      {/* Stats Overview */}
      <StatsOverview timeRange={timeRange} />

      {/* Activity Tabs */}
      <ActivityTabs />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <RecentActivity />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
