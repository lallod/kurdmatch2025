import { useState, useEffect } from 'react';
import { Search, X, Loader2, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchProfiles, Profile } from '@/api/profiles';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onResultClick?: (profile: Profile) => void;
}

export default function SearchBar({ onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const profiles = await searchProfiles({ query: query.trim() });
        setResults(profiles);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleResultClick = (profile: Profile) => {
    setShowResults(false);
    setQuery('');
    if (onResultClick) {
      onResultClick(profile);
    } else {
      navigate(`/profile/${profile.id}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, location, or interests..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            className="pl-10 pr-10 bg-background/50 backdrop-blur border-border"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/search')}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Advanced
        </Button>
      </div>

      {showResults && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="ml-2">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleResultClick(profile)}
                  className="w-full p-3 hover:bg-accent transition-colors flex items-center gap-3 text-left"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={profile.profile_image} alt={profile.name} />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">{profile.name}</span>
                      {profile.verified && (
                        <span className="text-blue-500">✓</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {profile.age} • {profile.location}
                    </div>
                    {profile.occupation && (
                      <div className="text-xs text-muted-foreground truncate">
                        {profile.occupation}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-muted-foreground">
              No profiles found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
