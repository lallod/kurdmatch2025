import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GifResult {
  id: string;
  url: string;
  preview: string;
  title: string;
}

interface GifPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectGif: (gifUrl: string) => void;
}

export const GifPicker = ({ open, onOpenChange, onSelectGif }: GifPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchGifs = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-gifs`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query.trim(), limit: '20' }),
      });

      if (response.ok) {
        const result = await response.json();
        setGifs(result.gifs || []);
      } else {
        console.error('Failed to fetch GIFs:', response.status);
        setGifs([]);
      }
    } catch (err) {
      console.error('Error fetching GIFs:', err);
      setGifs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load trending on open
  useEffect(() => {
    if (open) {
      fetchGifs('');
    }
  }, [open, fetchGifs]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchGifs(query), 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose a GIF</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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

          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : gifs.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {gifs.map((gif) => (
                  <button
                    key={gif.id}
                    onClick={() => {
                      onSelectGif(gif.url);
                      onOpenChange(false);
                    }}
                    className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 ring-primary transition-all"
                  >
                    <img
                      src={gif.preview}
                      alt={gif.title || 'GIF'}
                      className="w-full h-full object-cover"
                      loading="lazy"
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

          <p className="text-xs text-center text-muted-foreground">
            Powered by GIPHY
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
