
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DetailEditor from '@/components/DetailEditor';
import { Heart, Music, Coffee, Film, Utensils, Sparkles, Book, Headphones, Trophy, Globe, Pizza, Gamepad, MapPin } from 'lucide-react';

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
            title="Music" 
            fields={[
              { name: "favoriteMusic", label: "Favorite Artists/Genres", value: "Indie rock, Jazz, Electronic, Kurdish folk, Alternative, Hip-hop", type: "listInput" },
              { name: "musicLinks", label: "Spotify/YouTube Links", value: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd, https://www.youtube.com/watch?v=dQw4w9WgXcQ", type: "listInput" },
              { name: "concertExperience", label: "Best Concert Experience", value: "Seeing Radiohead play under a full moon in an ancient amphitheater" },
            ]}
            listMode={true}
          />
          
          <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
          
          <DetailEditor 
            icon={<Book size={18} />} 
            title="Books & Reading" 
            fields={[
              { name: "favoriteBooks", label: "Favorite Books", value: "The Alchemist, Thinking Fast and Slow, Dune, 1984, One Hundred Years of Solitude", type: "listInput" },
              { name: "favoriteAuthors", label: "Favorite Authors", value: "Gabriel García Márquez, Haruki Murakami, Jane Austen", type: "listInput" },
              { name: "readingHabits", label: "Reading Habits", value: "Before bed every night, and on weekend mornings with coffee" },
            ]}
            listMode={true}
          />
          
          <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
          
          <DetailEditor 
            icon={<Film size={18} />} 
            title="Movies & TV" 
            fields={[
              { name: "favoriteMovies", label: "Favorite Movies", value: "Lost in Translation, The Grand Budapest Hotel, Parasite, The Godfather, Before Sunrise", type: "listInput" },
              { name: "favoriteTV", label: "Favorite TV Shows", value: "Breaking Bad, The Office, Succession, Fleabag", type: "listInput" },
              { name: "favoriteDirectors", label: "Favorite Directors", value: "Christopher Nolan, Wes Anderson, Greta Gerwig", type: "listInput" },
            ]}
            listMode={true}
          />
          
          <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
          
          <DetailEditor 
            icon={<Utensils size={18} />} 
            title="Food & Drink" 
            fields={[
              { name: "favoriteFoods", label: "Favorite Cuisines", value: "Japanese, Mediterranean, Thai, Kurdish, Italian", type: "listInput" },
              { name: "favoriteDishes", label: "Signature Dishes", value: "Homemade pasta, Thai curry from scratch, Perfect chocolate chip cookies", type: "listInput" },
              { name: "coffeeOrTea", label: "Coffee or Tea", value: "Both - espresso in the morning, herbal tea at night" },
            ]}
            listMode={true}
          />

          <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
          
          <DetailEditor 
            icon={<Headphones size={18} />} 
            title="Podcasts & Audio" 
            fields={[
              { name: "favoritePodcasts", label: "Favorite Podcasts", value: "This American Life, RadioLab, How I Built This, 99% Invisible", type: "listInput" },
              { name: "audiobooks", label: "Audiobooks", value: "For road trips and while cooking" },
            ]}
            listMode={true}
          />
          
          <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
          
          <DetailEditor 
            icon={<Trophy size={18} />} 
            title="Sports & Activities" 
            fields={[
              { name: "favoriteTeams", label: "Favorite Teams", value: "Barcelona FC, Golden State Warriors", type: "listInput" },
              { name: "favoriteSports", label: "Favorite Sports", value: "Soccer, Basketball, Rock climbing, Yoga", type: "listInput" },
              { name: "outdoorActivities", label: "Outdoor Activities", value: "Hiking, Camping, Kayaking, Mountain biking", type: "listInput" },
            ]}
            listMode={true}
          />
          
          <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
          
          <DetailEditor 
            icon={<Gamepad size={18} />} 
            title="Games & Entertainment" 
            fields={[
              { name: "favoriteGames", label: "Favorite Games", value: "Chess, Catan, The Last of Us, Zelda: Breath of the Wild", type: "listInput" },
              { name: "boardGames", label: "Board Games", value: "Love strategy games like Settlers of Catan and cooperative games" },
              { name: "videoGames", label: "Video Games", value: "RPGs and story-driven adventures" },
            ]}
            listMode={true}
          />
          
          <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
          
          <DetailEditor 
            icon={<MapPin size={18} />} 
            title="Places" 
            fields={[
              { name: "favoriteDestinations", label: "Favorite Places", value: "Kyoto, Paris, Istanbul, Barcelona, New York City", type: "listInput" },
              { name: "travelWishlist", label: "Travel Wishlist", value: "New Zealand, Peru, Japan, Iceland, South Africa", type: "listInput" },
              { name: "localHangouts", label: "Local Hangouts", value: "The coffee shop on 3rd, The hiking trail north of town, The bookstore downtown" },
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
