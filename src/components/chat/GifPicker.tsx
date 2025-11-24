import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GifPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectGif: (gifUrl: string) => void;
}

// Sample GIF categories and trending GIFs (in production, use Giphy API)
const trendingGifs = [
  'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
  'https://media.giphy.com/media/l0HlRnAWXxn0MhKLK/giphy.gif',
  'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif',
  'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
  'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
  'https://media.giphy.com/media/26tPplGWjN0xLybiU/giphy.gif',
];

export const GifPicker = ({ open, onOpenChange, onSelectGif }: GifPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<string[]>(trendingGifs);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setGifs(trendingGifs);
      return;
    }

    setIsSearching(true);
    
    // In production, use Giphy API:
    // const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
    // const response = await fetch(
    //   `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=20`
    // );
    // const data = await response.json();
    // setGifs(data.data.map((gif: any) => gif.images.fixed_height.url));
    
    // For now, just filter trending
    setTimeout(() => {
      setGifs(trendingGifs);
      setIsSearching(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose a GIF</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search GIFs..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => handleSearch('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* GIF Grid */}
          <ScrollArea className="h-[400px]">
            {isSearching ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : gifs.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {gifs.map((gifUrl, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onSelectGif(gifUrl);
                      onOpenChange(false);
                    }}
                    className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 ring-primary transition-all"
                  >
                    <img
                      src={gifUrl}
                      alt="GIF"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">No GIFs found</p>
              </div>
            )}
          </ScrollArea>

          {/* Powered by Giphy */}
          <p className="text-xs text-center text-muted-foreground">
            Powered by GIPHY
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
