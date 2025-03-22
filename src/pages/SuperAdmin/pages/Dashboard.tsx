
import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsOverview from '../components/dashboard/StatsOverview';
import ActivityTabs from '../components/dashboard/ActivityTabs';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import { Brain } from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data reload
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6 relative">
      {/* AI-inspired background elements */}
      <div className="absolute top-20 right-10 opacity-5 w-64 h-64 rounded-full bg-tinder-rose filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 opacity-5 w-32 h-32 rounded-full bg-tinder-orange filter blur-2xl pointer-events-none"></div>
      
      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Enhanced Admin Dashboard</h3>
          <p className="text-sm text-gray-600">Smart analytics and intelligent user management features</p>
        </div>
      </div>
      
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
