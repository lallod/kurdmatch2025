
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X, Plus } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface FavoritesEditorProps {
  profileData: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const FavoritesEditor: React.FC<FavoritesEditorProps> = ({ profileData, onUpdate }) => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    favoriteBooks: Array.isArray(profileData.favoriteBooks) ? profileData.favoriteBooks : [],
    favoriteMovies: Array.isArray(profileData.favoriteMovies) ? profileData.favoriteMovies : [],
    favoriteMusic: Array.isArray(profileData.favoriteMusic) ? profileData.favoriteMusic : [],
    favoriteFoods: Array.isArray(profileData.favoriteFoods) ? profileData.favoriteFoods : [],
    favoriteQuote: profileData.favoriteQuote || '',
    dreamVacation: profileData.dreamVacation || ''
  });
  
  const [newItems, setNewItems] = useState({
    book: '',
    movie: '',
    music: '',
    food: ''
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddItem = (category: string, newItem: string) => {
    if (newItem.trim()) {
      const field = `favorite${category.charAt(0).toUpperCase() + category.slice(1)}s` as keyof typeof formData;
      const currentArray = formData[field] as string[];
      const updatedArray = [...currentArray, newItem.trim()];
      setFormData(prev => ({ ...prev, [field]: updatedArray }));
      setNewItems(prev => ({ ...prev, [category]: '' }));
      setHasChanges(true);
    }
  };

  const handleRemoveItem = (category: string, index: number) => {
    const field = `favorite${category.charAt(0).toUpperCase() + category.slice(1)}s` as keyof typeof formData;
    const currentArray = formData[field] as string[];
    const updatedArray = currentArray.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
    toast.success(t('toast.profile.favorites_updated', 'Favorites updated successfully!'));
  };

  const handleCancel = () => {
    setFormData({
      favoriteBooks: Array.isArray(profileData.favoriteBooks) ? profileData.favoriteBooks : [],
      favoriteMovies: Array.isArray(profileData.favoriteMovies) ? profileData.favoriteMovies : [],
      favoriteMusic: Array.isArray(profileData.favoriteMusic) ? profileData.favoriteMusic : [],
      favoriteFoods: Array.isArray(profileData.favoriteFoods) ? profileData.favoriteFoods : [],
      favoriteQuote: profileData.favoriteQuote || '',
      dreamVacation: profileData.dreamVacation || ''
    });
    setNewItems({ book: '', movie: '', music: '', food: '' });
    setHasChanges(false);
  };

  const renderFavoriteSection = (category: string, label: string, items: string[]) => (
    <div>
      <Label className="text-purple-200">{label}</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, index) => (
          <Badge
            key={index}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer hover:opacity-80"
            onClick={() => handleRemoveItem(category, index)}
          >
            {item} ×
          </Badge>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Input
          value={newItems[category as keyof typeof newItems]}
          onChange={(e) => setNewItems(prev => ({ ...prev, [category]: e.target.value }))}
          placeholder={`Add favorite ${category}`}
          className="bg-gray-700 border-gray-600 text-white"
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem(category, newItems[category as keyof typeof newItems])}
        />
        <Button
          onClick={() => handleAddItem(category, newItems[category as keyof typeof newItems])}
          size="icon"
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Favorites & Inspirations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderFavoriteSection('book', 'Favorite Books', formData.favoriteBooks)}
            {renderFavoriteSection('movie', 'Favorite Movies', formData.favoriteMovies)}
            {renderFavoriteSection('music', 'Favorite Music', formData.favoriteMusic)}
            {renderFavoriteSection('food', 'Favorite Foods', formData.favoriteFoods)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="favorite-quote" className="text-purple-200">Favorite Quote</Label>
              <Textarea
                id="favorite-quote"
                value={formData.favoriteQuote}
                onChange={(e) => handleInputChange('favoriteQuote', e.target.value)}
                rows={3}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="A quote that inspires you..."
              />
            </div>
            
            <div>
              <Label htmlFor="dream-vacation" className="text-purple-200">Dream Vacation</Label>
              <Textarea
                id="dream-vacation"
                value={formData.dreamVacation}
                onChange={(e) => handleInputChange('dreamVacation', e.target.value)}
                rows={3}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Where would you love to travel?"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavoritesEditor;
