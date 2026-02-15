import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Coins, Send, Loader2 } from 'lucide-react';
import { VirtualGift, getGiftCatalog, getUserCoins, sendGift } from '@/api/gifts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SendGiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
}

const CATEGORIES = ['all', 'romantic', 'casual', 'compliment', 'fun', 'nature', 'luxury'];

const SendGiftModal = ({ open, onOpenChange, recipientId, recipientName }: SendGiftModalProps) => {
  const [gifts, setGifts] = useState<VirtualGift[]>([]);
  const [selectedGift, setSelectedGift] = useState<VirtualGift | null>(null);
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(0);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoading(true);
      try {
        const [catalog, { data: { user } }] = await Promise.all([
          getGiftCatalog(),
          supabase.auth.getUser(),
        ]);
        setGifts(catalog);
        if (user) {
          const coins = await getUserCoins(user.id);
          setBalance(coins.balance);
        }
      } catch (err) {
        console.error('Failed to load gifts:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open]);

  const handleSend = async () => {
    if (!selectedGift) return;
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      await sendGift(user.id, recipientId, selectedGift.id, message || undefined);
      toast.success(`${selectedGift.emoji} ${selectedGift.name} sent to ${recipientName}!`);
      setBalance(prev => prev - selectedGift.price_coins);
      setSelectedGift(null);
      setMessage('');
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send gift');
    } finally {
      setSending(false);
    }
  };

  const filtered = category === 'all' ? gifts : gifts.filter(g => g.category === category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Send a Gift to {recipientName}</span>
            <Badge variant="outline" className="flex items-center gap-1 text-sm">
              <Coins className="h-3.5 w-3.5 text-yellow-500" />
              {balance}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            {/* Category filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <Button
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  size="sm"
                  className="capitalize text-xs shrink-0"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Gift grid */}
            <ScrollArea className="flex-1 max-h-[300px]">
              <div className="grid grid-cols-3 gap-2">
                {filtered.map(gift => (
                  <button
                    key={gift.id}
                    onClick={() => setSelectedGift(gift)}
                    className={`p-3 rounded-xl border-2 transition-all text-center hover:shadow-md ${
                      selectedGift?.id === gift.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50'
                    } ${gift.price_coins > balance ? 'opacity-40' : ''}`}
                    disabled={gift.price_coins > balance}
                  >
                    <span className="text-3xl block">{gift.emoji}</span>
                    <p className="text-xs font-medium mt-1 truncate">{gift.name}</p>
                    <div className="flex items-center justify-center gap-0.5 mt-0.5">
                      <Coins className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">{gift.price_coins}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>

            {/* Message & Send */}
            {selectedGift && (
              <div className="space-y-3 border-t pt-3">
                <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                  <span className="text-4xl">{selectedGift.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{selectedGift.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedGift.description}</p>
                  </div>
                  <Badge className="flex items-center gap-1">
                    <Coins className="h-3 w-3" />{selectedGift.price_coins}
                  </Badge>
                </div>
                <Textarea
                  placeholder="Add a message (optional)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none h-16"
                  maxLength={200}
                />
                <Button
                  onClick={handleSend}
                  disabled={sending}
                  className="w-full"
                  size="lg"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send {selectedGift.name}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SendGiftModal;
