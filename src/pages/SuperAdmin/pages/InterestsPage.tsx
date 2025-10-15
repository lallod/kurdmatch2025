import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Search, Tag, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Interest {
  id: string;
  name: string;
  category: string;
  created_at: string;
}

const InterestsPage = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newInterestName, setNewInterestName] = useState('');
  const [newInterestCategory, setNewInterestCategory] = useState('');

  const categories = [
    'Sports & Fitness',
    'Arts & Culture',
    'Music & Dance',
    'Food & Cooking',
    'Travel & Adventure',
    'Technology',
    'Books & Reading',
    'Movies & TV',
    'Games & Gaming',
    'Outdoor Activities',
    'Social Causes',
    'Business & Career',
    'Health & Wellness',
    'Fashion & Style',
    'Other'
  ];

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('interests')
        .select('*', { count: 'exact' })
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setInterests(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching interests:', error);
      toast.error('Failed to load interests');
    } finally {
      setLoading(false);
    }
  };

  const addInterest = async () => {
    if (!newInterestName || !newInterestCategory) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('interests')
        .insert([{ name: newInterestName, category: newInterestCategory }]);

      if (error) throw error;
      toast.success('Interest added successfully');
      setNewInterestName('');
      setNewInterestCategory('');
      setIsAddDialogOpen(false);
      fetchInterests();
    } catch (error) {
      console.error('Error adding interest:', error);
      toast.error('Failed to add interest');
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const filteredInterests = interests.filter(interest => {
    const search = searchTerm.toLowerCase();
    return interest.name.toLowerCase().includes(search) || interest.category.toLowerCase().includes(search);
  });

  const groupedInterests = filteredInterests.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<string, Interest[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Interests Management</h1>
          <p className="text-white/60 mt-1">Manage user interest categories ({totalCount} interests)</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Interest
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Interest</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="interest-name" className="text-white">Interest Name</Label>
                  <Input
                    id="interest-name"
                    value={newInterestName}
                    onChange={(e) => setNewInterestName(e.target.value)}
                    placeholder="e.g., Hiking, Photography, Cooking"
                    className="bg-white/5 border-white/10 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="interest-category" className="text-white">Category</Label>
                  <Select value={newInterestCategory} onValueChange={setNewInterestCategory}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-white">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addInterest} className="w-full bg-gradient-to-r from-purple-500 to-pink-600">
                  Add Interest
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={fetchInterests} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Refresh
          </Button>
        </div>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            All Interests
          </CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">Loading interests...</div>
          ) : Object.keys(groupedInterests).length === 0 ? (
            <div className="text-center py-8 text-white/60">No interests found</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedInterests).map(([category, categoryInterests]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-purple-500" />
                    <h3 className="text-white font-semibold">{category}</h3>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                      {categoryInterests.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryInterests.map((interest) => (
                      <Badge
                        key={interest.id}
                        variant="outline"
                        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 text-white px-4 py-2 text-sm"
                      >
                        {interest.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterestsPage;
