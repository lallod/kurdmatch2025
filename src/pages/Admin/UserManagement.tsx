import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Search, ShieldCheck, ShieldOff, Ban, UserCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  verified: boolean;
  created_at: string;
  last_active: string;
  profile_image: string;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'verify' | 'unverify' | 'ban' | null;
  }>({ open: false, action: null });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user!.id)
      .eq('role', 'super_admin')
      .single();

    if (!data) {
      navigate('/discovery');
      return;
    }

    fetchUsers();
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async () => {
    if (!selectedUser || !actionDialog.action) return;

    try {
      if (actionDialog.action === 'verify' || actionDialog.action === 'unverify') {
        const { error } = await supabase
          .from('profiles')
          .update({ verified: actionDialog.action === 'verify' })
          .eq('id', selectedUser.id);

        if (error) throw error;

        // Log admin activity
        await supabase.from('admin_activities').insert({
          user_id: user!.id,
          activity_type: actionDialog.action === 'verify' ? 'user_verified' : 'user_unverified',
          description: `${actionDialog.action === 'verify' ? 'Verified' : 'Unverified'} user: ${selectedUser.name}`,
        });

        toast({
          title: 'Success',
          description: `User ${actionDialog.action === 'verify' ? 'verified' : 'unverified'} successfully`,
        });
      } else if (actionDialog.action === 'ban') {
        // In a real app, you'd implement a ban mechanism
        toast({
          title: 'Feature not implemented',
          description: 'User banning will be implemented in a future update',
        });
      }

      fetchUsers();
      setActionDialog({ open: false, action: null });
      setSelectedUser(null);
    } catch (error) {
      console.error('Error performing action:', error);
      toast({
        title: 'Error',
        description: 'Failed to perform action',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'verified' && user.verified) ||
      (filterStatus === 'unverified' && !user.verified);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">User Management</h1>
              <p className="text-white/70 text-sm">{filteredUsers.length} users</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="unverified">Unverified Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {loading ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="py-12 text-center text-white">
              Loading users...
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((userProfile) => (
              <Card key={userProfile.id} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={userProfile.profile_image}
                      alt={userProfile.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{userProfile.name}</h3>
                        {userProfile.verified && (
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/70 text-sm">
                        {userProfile.age} • {userProfile.location}
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        Joined {new Date(userProfile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!userProfile.verified ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(userProfile);
                            setActionDialog({ open: true, action: 'verify' });
                          }}
                          className="text-white border-white/20 hover:bg-white/10"
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(userProfile);
                            setActionDialog({ open: true, action: 'unverify' });
                          }}
                          className="text-white border-white/20 hover:bg-white/10"
                        >
                          <ShieldOff className="w-4 h-4 mr-1" />
                          Unverify
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/profile/${userProfile.id}`)}
                        className="text-white border-white/20 hover:bg-white/10"
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Confirmation Dialog */}
        <AlertDialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ open, action: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription>
                {actionDialog.action === 'verify' && `Are you sure you want to verify ${selectedUser?.name}?`}
                {actionDialog.action === 'unverify' && `Are you sure you want to remove verification from ${selectedUser?.name}?`}
                {actionDialog.action === 'ban' && `Are you sure you want to ban ${selectedUser?.name}?`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUserAction}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserManagement;
