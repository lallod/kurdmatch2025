
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DetailEditor from '@/components/DetailEditor';
import { Heart, Music, Coffee, Film, Utensils, Sparkles } from 'lucide-react';

const PreferencesTab = () => {
  return (
    <Card className="mb-6 neo-card bg-white/80">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart size={20} className="mr-2 text-tinder-rose" />
          <span>Favorites & Preferences</span>
        </CardTitle>
        <CardDescription>Edit your favorite things and preferences. AI will match with compatible profiles.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <DetailEditor 
            icon={<Music size={18} />} 
            title="Music Links" 
            fields={[
              { name: "musicLinks", label: "Spotify/YouTube Links", value: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd, https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
            ]}
            listMode={true}
          />
          
          <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
          
          <DetailEditor 
            icon={<Coffee size={18} />} 
            title="Books" 
            fields={[
              { name: "books", label: "Favorite Books", value: "The Alchemist, Thinking Fast and Slow, Dune" },
            ]}
            listMode={true}
          />
          
          <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
          
          <DetailEditor 
            icon={<Film size={18} />} 
            title="Movies" 
            fields={[
              { name: "movies", label: "Favorite Movies", value: "Lost in Translation, The Grand Budapest Hotel, Parasite" },
            ]}
            listMode={true}
          />
          
          <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
          
          <DetailEditor 
            icon={<Utensils size={18} />} 
            title="Food" 
            fields={[
              { name: "foods", label: "Favorite Foods", value: "Japanese, Mediterranean, Thai, Italian" },
            ]}
            listMode={true}
          />
        </div>
        <div className="mt-6 w-full py-3 px-4 rounded-md bg-gradient-to-r from-tinder-rose/10 to-tinder-orange/10 flex items-center">
          <Sparkles size={18} className="text-tinder-rose mr-2" />
          <p className="text-sm text-gray-700">AI prediction: Your preferences are highly compatible with 24% of users in your area</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesTab;
