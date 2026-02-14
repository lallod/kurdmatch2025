import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Ban, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyPayment {
  month: string;
  amount: number;
}

interface MonthlyRegistration {
  month: string;
  male: number;
  female: number;
  other: number;
}

const DashboardNew = () => {
  const [stats, setStats] = useState({
    online: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    totalPrev: 0,
    activePrev: 0,
  });
  const [earningsData, setEarningsData] = useState<MonthlyPayment[]>([]);
  const [registrationsData, setRegistrationsData] = useState<MonthlyRegistration[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchEarnings();
    fetchRegistrations();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: activeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', oneDayAgo);

      const { count: blockedCount } = await supabase
        .from('blocked_users')
        .select('blocked_id', { count: 'exact', head: true });

      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count: onlineCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', fiveMinAgo);

      setStats({
        online: onlineCount || 0,
        active: activeCount || 0,
        inactive: (totalCount || 0) - (activeCount || 0),
        blocked: blockedCount || 0,
        totalPrev: 0,
        activePrev: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const now = new Date();
      const months: MonthlyPayment[] = [];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        const monthName = date.toLocaleString('en', { month: 'short' });

        const { data } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'completed')
          .gte('created_at', date.toISOString())
          .lt('created_at', nextMonth.toISOString());

        const total = (data || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        months.push({ month: monthName, amount: total });
      }

      setEarningsData(months);
      setTotalEarnings(months.reduce((s, m) => s + m.amount, 0));
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const now = new Date();
      const months: MonthlyRegistration[] = [];

      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        const monthName = date.toLocaleString('en', { month: 'short' });

        const { data } = await supabase
          .from('profiles')
          .select('gender')
          .gte('created_at', date.toISOString())
          .lt('created_at', nextMonth.toISOString());

        const profiles = data || [];
        months.push({
          month: monthName,
          male: profiles.filter(p => p.gender === 'male').length,
          female: profiles.filter(p => p.gender === 'female').length,
          other: profiles.filter(p => p.gender !== 'male' && p.gender !== 'female').length,
        });
      }

      setRegistrationsData(months);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const statCards = [
    {
      title: 'Online Users',
      value: stats.online,
      icon: Users,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: UserCheck,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Inactive Users',
      value: stats.inactive,
      icon: UserX,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Blocked Users',
      value: stats.blocked,
      icon: Ban,
      color: 'from-red-600 to-pink-600',
      bgColor: 'bg-red-600/10',
    }
  ];

  return (
    <div className="space-y-6">
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
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.title}</p>
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
          </div>

          <div className="mb-4">
            <div className="inline-block bg-white/10 rounded-lg px-3 py-1">
              <span className="text-white font-semibold">${totalEarnings.toFixed(2)}</span>
              <span className="text-white/40 text-xs ml-1">last 12 months</span>
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
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="amount" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
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
