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
      setGroups(data.slice(0, 4));
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 animate-pulse">
        <div className="h-6 bg-white/10 rounded mb-3"></div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-white/10 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (groups.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover-scale">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-semibold text-white">Groups</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/groups')}
          className="text-xs text-purple-300 hover:text-white h-7 px-2"
        >
          See all
        </Button>
      </div>

      <div className="space-y-2">
        {groups.slice(0, 3).map((group) => (
          <button
            key={group.id}
            onClick={() => navigate(`/groups/${group.id}`)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all group text-left"
          >
            {group.icon && (
              <span className="text-2xl flex-shrink-0">{group.icon}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                {group.name}
              </p>
              <p className="text-xs text-white/60 truncate">
                {group.member_count} members
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
