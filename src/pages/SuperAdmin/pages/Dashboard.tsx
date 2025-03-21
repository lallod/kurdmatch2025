
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Users, 
  MessageSquare, 
  ImageIcon, 
  Activity, 
  Tag, 
  Settings, 
  TrendingUp, 
  Heart, 
  Eye, 
  Clock, 
  UserPlus,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Mock data - in a real app, these would come from API calls
  const stats = [
    { 
      title: 'Total Users', 
      value: '12,345', 
      change: '+12% from last month', 
      icon: <Users className="h-6 w-6 text-blue-500" /> 
    },
    { 
      title: 'Active Conversations', 
      value: '843', 
      change: '+5% from last week', 
      icon: <MessageSquare className="h-6 w-6 text-green-500" /> 
    },
    { 
      title: 'Photos Uploaded', 
      value: '32,567', 
      change: '+8% from last month', 
      icon: <ImageIcon className="h-6 w-6 text-purple-500" /> 
    },
    { 
      title: 'User Activity', 
      value: '7,891', 
      change: '+15% from yesterday', 
      icon: <Activity className="h-6 w-6 text-orange-500" /> 
    },
  ];

  // Mock chart data
  const userActivityData = [
    { name: 'Jan', users: 4000, conversations: 2400 },
    { name: 'Feb', users: 3000, conversations: 1398 },
    { name: 'Mar', users: 2000, conversations: 9800 },
    { name: 'Apr', users: 2780, conversations: 3908 },
    { name: 'May', users: 1890, conversations: 4800 },
    { name: 'Jun', users: 2390, conversations: 3800 },
    { name: 'Jul', users: 3490, conversations: 4300 },
  ];

  const userRoleData = [
    { name: 'Free Users', value: 8543 },
    { name: 'Premium', value: 2789 },
    { name: 'Moderators', value: 113 },
    { name: 'Admins', value: 12 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  const recentActivityData = [
    { type: 'user_register', user: 'Alice Johnson', time: '2 minutes ago' },
    { type: 'user_upgrade', user: 'Bob Smith', time: '15 minutes ago' },
    { type: 'photo_upload', user: 'Carol Williams', time: '30 minutes ago' },
    { type: 'message_sent', user: 'Dave Miller', time: '45 minutes ago' },
    { type: 'profile_update', user: 'Emma Davis', time: '1 hour ago' },
  ];

  const activityIcons = {
    user_register: <UserPlus size={16} className="text-green-500" />,
    user_upgrade: <TrendingUp size={16} className="text-purple-500" />,
    photo_upload: <ImageIcon size={16} className="text-blue-500" />,
    message_sent: <Mail size={16} className="text-orange-500" />,
    profile_update: <Users size={16} className="text-gray-500" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Activity Trends</CardTitle>
            <CardDescription>Daily active users and conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={userActivityData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="conversations" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of user types</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivityData.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 py-2 border-b last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {activityIcons[activity.type as keyof typeof activityIcons]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {activity.type === 'user_register' && 'New user registration'}
                      {activity.type === 'user_upgrade' && 'User upgraded to premium'}
                      {activity.type === 'photo_upload' && 'New photos uploaded'}
                      {activity.type === 'message_sent' && 'New message sent'}
                      {activity.type === 'profile_update' && 'Profile updated'}
                    </p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
              <Users size={20} />
              <span>Add New User</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
              <MessageSquare size={20} />
              <span>Send Notification</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
              <Tag size={20} />
              <span>Manage Categories</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
              <Settings size={20} />
              <span>System Settings</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
              <Heart size={20} />
              <span>Manage Likes</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
              <Eye size={20} />
              <span>View Analytics</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
