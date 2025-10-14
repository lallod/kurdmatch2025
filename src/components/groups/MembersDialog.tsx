import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getGroupMembers } from '@/api/groups';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Crown, Shield, UserCheck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MembersDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MembersDialog = ({ groupId, open, onOpenChange }: MembersDialogProps) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open) {
      loadMembers();
    }
  }, [open, groupId]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getGroupMembers(groupId);
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => 
    member.profiles?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'moderator':
        return <Shield className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] glass backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Group Members
            <Badge variant="secondary" className="ml-2">
              {members.length}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            View and manage group members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 glass border-border/50"
            />
          </div>

          {/* Members List */}
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-muted/30" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted/30 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-muted/30 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No members found' : 'No members yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl glass border border-border/50 hover:border-primary/50 transition-all"
                  >
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={member.profiles?.profile_image} />
                      <AvatarFallback>
                        {member.profiles?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">
                          {member.profiles?.name || 'Unknown User'}
                        </p>
                        {member.profiles?.verified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>

                    <Badge variant={getRoleBadgeVariant(member.role)} className="gap-1">
                      {getRoleIcon(member.role)}
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
