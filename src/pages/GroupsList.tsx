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
    { value: 'professional', label: 'Professional', icon: '💼', color: 'from-blue-500/20 to-blue-600/20' },
    { value: 'lifestyle', label: 'Lifestyle', icon: '🌟', color: 'from-pink-500/20 to-rose-600/20' },
    { value: 'culture', label: 'Culture', icon: '🎵', color: 'from-purple-500/20 to-violet-600/20' },
    { value: 'travel', label: 'Travel', icon: '✈️', color: 'from-green-500/20 to-emerald-600/20' },
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

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'from-muted/20 to-muted/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 glass backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                <Users className="h-8 w-8 text-primary" />
                Groups
              </h1>
              <p className="text-muted-foreground mt-1">Connect with Kurdish communities</p>
            </div>
            <Button size="icon" variant="default" className="rounded-full h-12 w-12 shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 glass border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={!selectedCategory ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(undefined)}
              className="rounded-full"
            >
              All Groups
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className="rounded-full whitespace-nowrap"
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass rounded-xl border border-border/50 p-6 animate-pulse">
                <div className="w-full h-40 bg-muted/30 rounded-lg mb-4"></div>
                <div className="h-6 bg-muted/30 rounded mb-2"></div>
                <div className="h-4 bg-muted/30 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="glass rounded-2xl border border-border/50 p-12 text-center">
            <Users className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-semibold mb-3">No groups found</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Be the first to create a group and start building your community!
            </p>
            <Button size="lg" className="rounded-full shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Group
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {groups.map((group, index) => (
              <button
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="group text-left glass rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Cover Image with Gradient Overlay */}
                <div className="relative h-40 overflow-hidden">
                  {group.cover_image ? (
                    <>
                      <img
                        src={group.cover_image}
                        alt={group.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(group.category)} to-transparent`}></div>
                    </>
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(group.category)}`}></div>
                  )}
                  
                  {/* Badge */}
                  {group.post_count > 5 && (
                    <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full text-xs font-medium border border-primary/30">
                      🔥 Active
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    {group.icon && (
                      <span className="text-3xl flex-shrink-0">{group.icon}</span>
                    )}
                    <h3 className="font-bold text-lg flex-1 group-hover:text-primary transition-colors line-clamp-2">
                      {group.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {group.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{group.member_count}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="font-medium">{group.post_count}</span>
                      <span>posts</span>
                    </div>
                  </div>
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
