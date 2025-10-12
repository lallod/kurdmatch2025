import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getGroups } from '@/api/groups';
import BottomNavigation from '@/components/BottomNavigation';
import type { Group } from '@/api/groups';

export const GroupsList = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const categories = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'lifestyle', label: 'Lifestyle', icon: '🌟' },
    { value: 'culture', label: 'Culture', icon: '🎵' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
  ];

  useEffect(() => {
    loadGroups();
  }, [selectedCategory, searchQuery]);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await getGroups({
        category: selectedCategory,
        search: searchQuery
      });
      setGroups(data);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Groups
            </h1>
            <Button size="icon" variant="outline">
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={!selectedCategory ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(undefined)}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No groups found</h2>
            <p className="text-muted-foreground mb-4">
              Be the first to create a group!
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="text-left p-4 rounded-lg border border-border hover:border-primary transition-colors bg-card"
              >
                {group.cover_image && (
                  <img
                    src={group.cover_image}
                    alt={group.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                )}
                <div className="flex items-start gap-2 mb-2">
                  {group.icon && <span className="text-2xl">{group.icon}</span>}
                  <h3 className="font-semibold flex-1">{group.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {group.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{group.member_count} members</span>
                  <span>{group.post_count} posts</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};
