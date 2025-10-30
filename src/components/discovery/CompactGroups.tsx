import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getGroups } from '@/api/groups';
import type { Group } from '@/api/groups';

export const CompactGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await getGroups({});
      setGroups(data.slice(0, 2));
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-16 mb-2"></div>
        <div className="space-y-1.5">
          {[1, 2].map((i) => (
            <div key={i} className="h-8 bg-white/10 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (groups.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Groups</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/groups')}
          className="text-xs text-purple-300 hover:text-white h-6 px-1.5"
        >
          All
        </Button>
      </div>

      <div className="space-y-1.5">
        {groups.slice(0, 2).map((group) => (
          <button
            key={group.id}
            onClick={() => navigate(`/groups/${group.id}`)}
            className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-purple-500/20 transition-all group text-left"
          >
            {group.icon && (
              <span className="text-lg flex-shrink-0">{group.icon}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                {group.name}
              </p>
              <p className="text-xs text-white/50 truncate">
                {group.member_count}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
