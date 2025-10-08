import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, XCircle, AlertCircle, PlayCircle } from 'lucide-react';

interface TestItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'pending' | 'passed' | 'failed' | 'running';
  instructions: string[];
}

const TestingDashboard = () => {
  const [tests, setTests] = useState<TestItem[]>([
    // Authentication Tests
    {
      id: 'auth-1',
      name: 'User Registration Flow',
      description: 'Complete user registration from start to finish',
      category: 'authentication',
      status: 'pending',
      instructions: [
        'Navigate to /auth',
        'Click "Sign Up" or registration option',
        'Fill in email and password on Step 1',
        'Verify password validation works (min 6 chars)',
        'Verify password confirmation matching works',
        'Click Next and complete Step 2 (Basic Info)',
        'Fill in name, age, gender, etc.',
        'Click Next and complete Step 3 (Location)',
        'Click Next and upload photos on Step 4',
        'Submit registration and verify success'
      ]
    },
    {
      id: 'auth-2',
      name: 'Login with Valid Credentials',
      description: 'Test login functionality',
      category: 'authentication',
      status: 'pending',
      instructions: [
        'Navigate to /auth',
        'Enter valid email and password',
        'Click Login',
        'Verify successful redirect to main page',
        'Check user session is maintained'
      ]
    },
    {
      id: 'auth-3',
      name: 'Login with Invalid Credentials',
      description: 'Test error handling for wrong credentials',
      category: 'authentication',
      status: 'pending',
      instructions: [
        'Navigate to /auth',
        'Enter invalid email or password',
        'Click Login',
        'Verify error message is displayed',
        'Verify user is not logged in'
      ]
    },
    {
      id: 'auth-4',
      name: 'Logout Functionality',
      description: 'Test user logout',
      category: 'authentication',
      status: 'pending',
      instructions: [
        'Login to the app',
        'Navigate to profile or settings',
        'Click Logout button',
        'Verify redirect to login page',
        'Verify session is cleared',
        'Try accessing protected route - should redirect to login'
      ]
    },
    
    // Profile Management Tests
    {
      id: 'profile-1',
      name: 'View Own Profile',
      description: 'View and verify profile information',
      category: 'profile',
      status: 'pending',
      instructions: [
        'Login to the app',
        'Navigate to /profile',
        'Verify all profile information is displayed',
        'Check profile image loads',
        'Verify bio, interests, and other details show correctly'
      ]
    },
    {
      id: 'profile-2',
      name: 'Edit Profile Information',
      description: 'Update profile fields',
      category: 'profile',
      status: 'pending',
      instructions: [
        'Navigate to /profile',
        'Click Edit or similar button',
        'Update bio text',
        'Update occupation',
        'Add/remove interests',
        'Save changes',
        'Verify changes are persisted',
        'Refresh page and verify changes remain'
      ]
    },
    {
      id: 'profile-3',
      name: 'Upload Profile Photo',
      description: 'Test photo upload functionality',
      category: 'profile',
      status: 'pending',
      instructions: [
        'Navigate to profile edit',
        'Click photo upload area',
        'Select an image file',
        'Verify image preview appears',
        'Save/upload the photo',
        'Verify photo appears in profile',
        'Check photo URL is valid'
      ]
    },
    
    // Discovery & Matching Tests
    {
      id: 'match-1',
      name: 'Browse Discovery Feed',
      description: 'View potential matches',
      category: 'matching',
      status: 'pending',
      instructions: [
        'Navigate to /swipe or discovery page',
        'Verify profiles are displayed',
        'Check profile images load',
        'Verify profile information is visible',
        'Check navigation between profiles works'
      ]
    },
    {
      id: 'match-2',
      name: 'Like a Profile',
      description: 'Send a like to another user',
      category: 'matching',
      status: 'pending',
      instructions: [
        'Navigate to discovery/swipe',
        'Click Like button or swipe right',
        'Verify like animation/feedback',
        'Check daily like count updates',
        'Verify profile moves to next one'
      ]
    },
    {
      id: 'match-3',
      name: 'Pass on a Profile',
      description: 'Skip a profile without liking',
      category: 'matching',
      status: 'pending',
      instructions: [
        'Navigate to discovery/swipe',
        'Click Pass/X button or swipe left',
        'Verify profile is skipped',
        'Verify next profile appears',
        'Check passed profile doesn\'t reappear immediately'
      ]
    },
    {
      id: 'match-4',
      name: 'View Matches',
      description: 'See mutual matches',
      category: 'matching',
      status: 'pending',
      instructions: [
        'Navigate to matches page',
        'Verify matched users are displayed',
        'Check match date/time is shown',
        'Click on a match to view profile',
        'Verify you can start a conversation'
      ]
    },
    {
      id: 'match-5',
      name: 'Daily Like Limit',
      description: 'Test free tier like limits',
      category: 'matching',
      status: 'pending',
      instructions: [
        'Like multiple profiles',
        'Check daily usage counter',
        'Try to exceed 50 likes (free tier)',
        'Verify limit warning appears',
        'Verify upgrade prompt is shown if limit reached'
      ]
    },
    
    // Messaging Tests
    {
      id: 'msg-1',
      name: 'Send Message to Match',
      description: 'Test messaging functionality',
      category: 'messaging',
      status: 'pending',
      instructions: [
        'Navigate to matches',
        'Click on a match',
        'Open conversation',
        'Type a message',
        'Send message',
        'Verify message appears in conversation',
        'Check timestamp is correct'
      ]
    },
    {
      id: 'msg-2',
      name: 'Receive and Read Message',
      description: 'Test message reception',
      category: 'messaging',
      status: 'pending',
      instructions: [
        'Have another user send you a message',
        'Check notification appears',
        'Navigate to messages',
        'Open conversation',
        'Verify message is displayed',
        'Check read status updates'
      ]
    },
    {
      id: 'msg-3',
      name: 'Block User',
      description: 'Test blocking functionality',
      category: 'messaging',
      status: 'pending',
      instructions: [
        'Open a conversation',
        'Click user options/settings',
        'Select Block User',
        'Confirm block action',
        'Verify user is blocked',
        'Check blocked user no longer appears in discovery',
        'Verify cannot receive messages from blocked user'
      ]
    },
    {
      id: 'msg-4',
      name: 'Report User/Message',
      description: 'Test reporting functionality',
      category: 'messaging',
      status: 'pending',
      instructions: [
        'Open a conversation or profile',
        'Click Report option',
        'Select a report reason',
        'Add description',
        'Submit report',
        'Verify confirmation message',
        'Check report is recorded'
      ]
    },
    
    // Social Features Tests
    {
      id: 'social-1',
      name: 'Create Post',
      description: 'Test social feed posting',
      category: 'social',
      status: 'pending',
      instructions: [
        'Navigate to social feed/community',
        'Click Create Post button',
        'Write post content',
        'Add photo (optional)',
        'Publish post',
        'Verify post appears in feed',
        'Check like and comment options work'
      ]
    },
    {
      id: 'social-2',
      name: 'Like and Comment on Posts',
      description: 'Test engagement features',
      category: 'social',
      status: 'pending',
      instructions: [
        'Navigate to social feed',
        'Find a post',
        'Click Like button',
        'Verify like count increases',
        'Click Comment',
        'Write and submit comment',
        'Verify comment appears'
      ]
    },
    {
      id: 'social-3',
      name: 'View and Create Stories',
      description: 'Test stories feature',
      category: 'social',
      status: 'pending',
      instructions: [
        'Navigate to stories section',
        'Click Add Story',
        'Upload photo/video',
        'Add text/stickers',
        'Publish story',
        'Verify story appears',
        'Check 24-hour expiration is set'
      ]
    },
    {
      id: 'social-4',
      name: 'Follow/Unfollow Users',
      description: 'Test follow functionality',
      category: 'social',
      status: 'pending',
      instructions: [
        'Navigate to a user profile',
        'Click Follow button',
        'Verify follow status changes',
        'Check follower count updates',
        'Click Unfollow',
        'Verify unfollow works'
      ]
    },
    
    // Super Admin Tests
    {
      id: 'admin-1',
      name: 'Access Admin Dashboard',
      description: 'Test admin authentication',
      category: 'admin',
      status: 'pending',
      instructions: [
        'Login as super admin user',
        'Navigate to /super-admin',
        'Verify admin dashboard loads',
        'Check role verification works',
        'Non-admin users should be blocked'
      ]
    },
    {
      id: 'admin-2',
      name: 'View User Management',
      description: 'Test user management interface',
      category: 'admin',
      status: 'pending',
      instructions: [
        'Navigate to Admin > Users',
        'Verify user list loads',
        'Check pagination works',
        'Test search functionality',
        'Apply filters (status, role)',
        'Verify filter results are correct'
      ]
    },
    {
      id: 'admin-3',
      name: 'Verify User',
      description: 'Test user verification',
      category: 'admin',
      status: 'pending',
      instructions: [
        'Navigate to user management',
        'Select an unverified user',
        'Click Verify button',
        'Confirm action',
        'Verify user status changes to verified',
        'Check verification badge appears'
      ]
    },
    {
      id: 'admin-4',
      name: 'Review Reports',
      description: 'Test content moderation',
      category: 'admin',
      status: 'pending',
      instructions: [
        'Navigate to Admin > Reports',
        'View pending reports',
        'Click on a report',
        'Review details',
        'Take action (resolve/dismiss)',
        'Verify report status updates'
      ]
    },
    {
      id: 'admin-5',
      name: 'View Analytics',
      description: 'Test analytics dashboard',
      category: 'admin',
      status: 'pending',
      instructions: [
        'Navigate to Admin > Analytics',
        'Verify stats are displayed',
        'Check user growth charts',
        'Review revenue metrics',
        'Check engagement data',
        'Verify data is accurate'
      ]
    },
    {
      id: 'admin-6',
      name: 'Export User Data',
      description: 'Test data export functionality',
      category: 'admin',
      status: 'pending',
      instructions: [
        'Navigate to Admin > Data Export',
        'Click Create Export',
        'Select export type (users)',
        'Choose format (CSV)',
        'Submit export request',
        'Verify export job is created',
        'Check export status updates'
      ]
    },
    
    // Subscription & Payment Tests
    {
      id: 'sub-1',
      name: 'View Subscription Plans',
      description: 'Test subscription page',
      category: 'subscription',
      status: 'pending',
      instructions: [
        'Navigate to subscription/pricing page',
        'Verify all plans are displayed',
        'Check pricing is correct',
        'Review feature differences',
        'Verify upgrade buttons work'
      ]
    },
    {
      id: 'sub-2',
      name: 'Check Premium Features',
      description: 'Verify premium user features',
      category: 'subscription',
      status: 'pending',
      instructions: [
        'As premium user, verify unlimited likes',
        'Check advanced filters work',
        'Test priority profile visibility',
        'Verify no ads are shown',
        'Check exclusive features access'
      ]
    },
  ]);

  const updateTestStatus = (testId: string, status: 'passed' | 'failed' | 'running') => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status } : test
    ));
  };

  const categories = {
    authentication: { name: 'Authentication', icon: '🔐' },
    profile: { name: 'Profile Management', icon: '👤' },
    matching: { name: 'Discovery & Matching', icon: '❤️' },
    messaging: { name: 'Messaging', icon: '💬' },
    social: { name: 'Social Features', icon: '📱' },
    admin: { name: 'Super Admin', icon: '⚙️' },
    subscription: { name: 'Subscriptions', icon: '💳' },
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'failed': return <XCircle className="w-5 h-5 text-destructive" />;
      case 'running': return <PlayCircle className="w-5 h-5 text-primary animate-pulse" />;
      default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-success/10 text-success';
      case 'failed': return 'bg-destructive/10 text-destructive';
      case 'running': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const calculateStats = () => {
    const total = tests.length;
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const pending = tests.filter(t => t.status === 'pending').length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    return { total, passed, failed, pending, passRate };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manual Testing Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Follow these test cases to verify all functionality works correctly
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Tests</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Passed</CardDescription>
              <CardTitle className="text-3xl text-success">{stats.passed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Failed</CardDescription>
              <CardTitle className="text-3xl text-destructive">{stats.failed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-muted-foreground">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pass Rate</CardDescription>
              <CardTitle className="text-3xl text-primary">{stats.passRate}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Test Categories */}
        <Tabs defaultValue="authentication" className="w-full">
          <TabsList className="grid grid-cols-7 w-full">
            {Object.entries(categories).map(([key, { name, icon }]) => (
              <TabsTrigger key={key} value={key} className="text-xs">
                <span className="mr-1">{icon}</span>
                <span className="hidden md:inline">{name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(categories).map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {tests
                .filter(test => test.category === category)
                .map((test) => (
                  <Card key={test.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(test.status)}
                            <CardTitle className="text-lg">{test.name}</CardTitle>
                            <Badge className={getStatusColor(test.status)}>
                              {test.status}
                            </Badge>
                          </div>
                          <CardDescription className="mt-2">
                            {test.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Test Instructions:</h4>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            {test.instructions.map((instruction, idx) => (
                              <li key={idx}>{instruction}</li>
                            ))}
                          </ol>
                        </div>
                        {test.status === 'running' && (
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                            <p className="text-sm font-medium text-primary mb-2">
                              ✅ Now follow the instructions above manually, then mark the result:
                            </p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          {test.status !== 'running' ? (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => updateTestStatus(test.id, 'running')}
                              className="w-full"
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Start Manual Test
                            </Button>
                          ) : (
                            <>
                              <Button 
                                size="sm"
                                variant="default"
                                onClick={() => updateTestStatus(test.id, 'passed')}
                                className="flex-1"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                ✅ Passed
                              </Button>
                              <Button 
                                size="sm"
                                variant="destructive"
                                onClick={() => updateTestStatus(test.id, 'failed')}
                                className="flex-1"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                ❌ Failed
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default TestingDashboard;
