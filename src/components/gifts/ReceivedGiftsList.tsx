import React, { useState, useEffect } from 'react';
import { SentGift, getReceivedGifts } from '@/api/gifts';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Gift, Loader2 } from 'lucide-react';

interface ReceivedGiftsListProps {
  userId?: string;
  limit?: number;
}

const ReceivedGiftsList = ({ userId, limit }: ReceivedGiftsListProps) => {
  const [gifts, setGifts] = useState<SentGift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        let uid = userId;
        if (!uid) {
          const { data: { user } } = await supabase.auth.getUser();
          uid = user?.id;
        }
        if (!uid) return;
        const data = await getReceivedGifts(uid);
        setGifts(limit ? data.slice(0, limit) : data);
      } catch (err) {
        console.error('Failed to load received gifts:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (gifts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Gift className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No gifts received yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {gifts.map(sg => {
        const gift = sg.gift as any;
        const sender = sg.sender as any;
        const senderPhoto = sender?.photos?.find((p: any) => p.is_primary)?.url || sender?.photos?.[0]?.url;

        return (
          <div key={sg.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <span className="text-3xl">{gift?.emoji || '🎁'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{gift?.name || 'Gift'}</p>
                {!sg.read && <Badge variant="destructive" className="text-[10px] px-1 py-0">New</Badge>}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                From {sender?.name || 'Someone'} · {formatDistanceToNow(new Date(sg.created_at), { addSuffix: true })}
              </p>
              {sg.message && (
                <p className="text-xs text-muted-foreground mt-0.5 italic truncate">"{sg.message}"</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReceivedGiftsList;
