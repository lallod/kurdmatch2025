import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Ban, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DashboardNew = () => {
  const [stats, setStats] = useState({
    online: 0,
    active: 0,
    inactive: 0,
    blocked: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (logged in within last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: activeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', oneDayAgo);

      // Get blocked users
      const { count: blockedCount } = await supabase
        .from('blocked_users')
        .select('blocked_id', { count: 'exact', head: true });

      // Get online users (last 5 minutes)
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count: onlineCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', fiveMinAgo);

      setStats({
        online: onlineCount || 0,
        active: activeCount || 0,
        inactive: (totalCount || 0) - (activeCount || 0),
        blocked: blockedCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Mock data for earnings chart
  const earningsData = [
    { month: 'Jan', lastYear: 800, thisYear: 1100 },
    { month: 'Feb', lastYear: 900, thisYear: 950 },
    { month: 'Mar', lastYear: 950, thisYear: 1000 },
    { month: 'Apr', lastYear: 1000, thisYear: 1050 },
    { month: 'May', lastYear: 850, thisYear: 1000 },
    { month: 'Jun', lastYear: 900, thisYear: 1100 },
    { month: 'Jul', lastYear: 950, thisYear: 1000 },
    { month: 'Aug', lastYear: 1000, thisYear: 1050 },
    { month: 'Sep', lastYear: 1100, thisYear: 900 },
    { month: 'Oct', lastYear: 1050, thisYear: 950 },
    { month: 'Nov', lastYear: 1000, thisYear: 1000 },
    { month: 'Dec', lastYear: 950, thisYear: 1100 }
  ];

  // Mock data for registrations chart
  const registrationsData = [
    { month: 'Jan', male: 120, female: 140, other: 30 },
    { month: 'Feb', male: 110, female: 150, other: 25 },
    { month: 'Mar', male: 130, female: 160, other: 35 },
    { month: 'Apr', male: 140, female: 170, other: 40 },
    { month: 'May', male: 125, female: 155, other: 32 },
    { month: 'Jun', male: 135, female: 165, other: 38 },
    { month: 'Jul', male: 145, female: 175, other: 42 },
    { month: 'Aug', male: 130, female: 160, other: 35 },
    { month: 'Sep', male: 120, female: 150, other: 30 },
    { month: 'Oct', male: 140, female: 170, other: 40 },
    { month: 'Nov', male: 150, female: 180, other: 45 },
    { month: 'Dec', male: 160, female: 190, other: 50 }
  ];

  const statCards = [
    {
      title: 'Online Users',
      value: stats.online,
      icon: Users,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      trend: '+12%'
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: UserCheck,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      trend: '+8%'
    },
    {
      title: 'Inactive Users',
      value: stats.inactive,
      icon: UserX,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      trend: '-3%'
    },
    {
      title: 'Blocked Users',
      value: stats.blocked,
      icon: Ban,
      color: 'from-red-600 to-pink-600',
      bgColor: 'bg-red-600/10',
      trend: '+2%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/60">Welcome back! Here's what's happening with your app today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-[#141414] border-white/5 p-6 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} text-white`} style={{ 
                    WebkitMaskImage: 'linear-gradient(white, white)',
                    maskImage: 'linear-gradient(white, white)'
                  }} />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trend.startsWith('+') ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.title}</p>
              </div>

              {/* User Avatars */}
              <div className="flex -space-x-2 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-[#141414]" />
                ))}
                <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#141414] flex items-center justify-center">
                  <span className="text-[10px] text-white/60">+</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Overview */}
        <Card className="bg-[#141414] border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Earning Overview</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-white/60">Last year</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <span className="text-white/60">Year 2022</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="inline-block bg-white/10 rounded-lg px-3 py-1">
              <span className="text-white font-semibold">$1100.50</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff40" style={{ fontSize: '12px' }} />
              <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Line type="monotone" dataKey="lastYear" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="thisYear" stroke="#ffffff60" strokeWidth={2} dot={{ fill: '#fff', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Registrations Chart */}
        <Card className="bg-[#141414] border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Last 12 Month Registrations</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <span className="text-white/60">Male</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-white/60">Female</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-600" />
                <span className="text-white/60">Other</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={registrationsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff40" style={{ fontSize: '12px' }} />
              <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="male" fill="#ffffff60" radius={[4, 4, 0, 0]} />
              <Bar dataKey="female" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="other" fill="#4b5563" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default DashboardNew;
