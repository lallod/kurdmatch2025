import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Edit2, Save, X, Plus, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Translation {
  id: string;
  language_code: string;
  translation_key: string;
  translation_value: string;
  context?: string;
  category: string;
  needs_review: boolean;
  auto_translated: boolean;
  created_at: string;
  updated_at: string;
}

const TranslationsPage = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterNeedsReview, setFilterNeedsReview] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'kurdish_sorani', name: 'Kurdish Sorani' },
    { code: 'kurdish_kurmanci', name: 'Kurdish Kurmanci' },
    { code: 'norwegian', name: 'Norwegian' },
    { code: 'german', name: 'German' }
  ];

  const categories = ['all', 'auth', 'common', 'navigation', 'discovery', 'messages', 'profile', 'swipe', 'settings', 'notifications', 'validation', 'errors', 'filters', 'attributes', 'actions'];

  useEffect(() => {
    fetchTranslations();
  }, [selectedLanguage, selectedCategory, filterNeedsReview]);

  const fetchTranslations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('app_translations')
        .select('*')
        .order('translation_key');

      if (selectedLanguage !== 'all') {
        query = query.eq('language_code', selectedLanguage);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (filterNeedsReview) {
        query = query.eq('needs_review', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTranslations(data || []);
    } catch (error) {
      console.error('Error fetching translations:', error);
      toast.error('Failed to load translations');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (translation: Translation) => {
    setEditingId(translation.id);
    setEditValue(translation.translation_value);
  };

  const handleSave = async (id: string, key: string) => {
    try {
      const { error } = await supabase
        .from('app_translations')
        .update({ 
          translation_value: editValue,
          needs_review: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Translation updated successfully');
      setEditingId(null);
      fetchTranslations();
    } catch (error) {
      console.error('Error updating translation:', error);
      toast.error('Failed to update translation');
    }
  };

  const handleMarkReviewed = async (id: string) => {
    try {
      const { error } = await supabase
        .from('app_translations')
        .update({ needs_review: false })
        .eq('id', id);

      if (error) throw error;

      toast.success('Marked as reviewed');
      fetchTranslations();
    } catch (error) {
      console.error('Error marking as reviewed:', error);
      toast.error('Failed to mark as reviewed');
    }
  };

  const filteredTranslations = translations.filter(t => 
    t.translation_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.translation_value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const needsReviewCount = translations.filter(t => t.needs_review).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Translation Management</h1>
          <p className="text-muted-foreground">Manage app translations across all languages</p>
        </div>
        <div className="flex items-center gap-2">
          {needsReviewCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="w-3 h-3" />
              {needsReviewCount} Need Review
            </Badge>
          )}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Translation
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search translations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={filterNeedsReview ? "default" : "outline"}
              onClick={() => setFilterNeedsReview(!filterNeedsReview)}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Needs Review Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Translations Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Translations ({filteredTranslations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTranslations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No translations found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTranslations.map((translation) => (
                <div
                  key={translation.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {translation.translation_key}
                      </code>
                      <Badge variant="outline" className="text-xs">
                        {translation.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {languages.find(l => l.code === translation.language_code)?.name}
                      </Badge>
                      {translation.needs_review && (
                        <Badge variant="destructive" className="text-xs gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Needs Review
                        </Badge>
                      )}
                    </div>
                    
                    {editingId === translation.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSave(translation.id, translation.translation_key)}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm flex-1">{translation.translation_value}</p>
                        <div className="flex items-center gap-1">
                          {translation.needs_review && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkReviewed(translation.id)}
                              title="Mark as reviewed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(translation)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {translation.context && (
                      <p className="text-xs text-muted-foreground">
                        Context: {translation.context}
                      </p>
                    )}
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

export default TranslationsPage;
