
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, ImageIcon, Activity } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex items-center gap-4 py-2 border-b last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">User registration</p>
                    <p className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
