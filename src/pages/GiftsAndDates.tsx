import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, CalendarIcon, Coins, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { getUserCoins, getReceivedGifts, getSentGifts, getDateProposals, respondToDateProposal, cancelDateProposal } from '@/api/gifts';
import type { SentGift, DateProposal, UserCoins } from '@/api/gifts';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

const GiftsAndDatesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const [coins, setCoins] = useState<UserCoins | null>(null);
  const [receivedGifts, setReceivedGifts] = useState<SentGift[]>([]);
  const [sentGifts, setSentGifts] = useState<SentGift[]>([]);
  const [dates, setDates] = useState<DateProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      try {
        const [c, r, s, d] = await Promise.all([
          getUserCoins(user.id),
          getReceivedGifts(user.id),
          getSentGifts(user.id),
          getDateProposals(user.id),
        ]);
        setCoins(c);
        setReceivedGifts(r);
        setSentGifts(s);
        setDates(d);
      } catch (err) {
        console.error('Error loading gifts & dates:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDateResponse = async (id: string, status: 'accepted' | 'declined') => {
    try {
      await respondToDateProposal(id, status);
      setDates(prev => prev.map(d => d.id === id ? { ...d, status, responded_at: new Date().toISOString() } : d));
      toast.success(status === 'accepted' ? t('toast.date.accepted', 'Date accepted! 🎉') : t('toast.date.declined', 'Date declined'));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCancelDate = async (id: string) => {
    try {
      await cancelDateProposal(id);
      setDates(prev => prev.map(d => d.id === id ? { ...d, status: 'cancelled' as const } : d));
      toast.success(t('toast.date.cancelled', 'Date cancelled'));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const unreadGifts = receivedGifts.filter(g => !g.read).length;
  const pendingDates = dates.filter(d => d.status === 'pending' && d.recipient_id === userId).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/60">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold">Gifts & Dates</h1>
          <Badge variant="outline" className="flex items-center gap-1">
            <Coins className="h-3.5 w-3.5 text-yellow-500" />
            {coins?.balance ?? 0}
          </Badge>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4">
        <Tabs defaultValue="received">
          <TabsList className="w-full">
            <TabsTrigger value="received" className="flex-1 gap-1">
              <Gift className="h-4 w-4" />
              Received
              {unreadGifts > 0 && <Badge variant="destructive" className="text-[10px] px-1 py-0 ml-1">{unreadGifts}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex-1 gap-1">
              Sent
            </TabsTrigger>
            <TabsTrigger value="dates" className="flex-1 gap-1">
              <CalendarIcon className="h-4 w-4" />
              Dates
              {pendingDates > 0 && <Badge variant="destructive" className="text-[10px] px-1 py-0 ml-1">{pendingDates}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-4 space-y-2">
            {receivedGifts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Gift className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No gifts received yet</p>
              </div>
            ) : receivedGifts.map(sg => {
              const gift = sg.gift as any;
              const sender = sg.sender as any;
              return (
                <div key={sg.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <span className="text-3xl">{gift?.emoji || '🎁'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{gift?.name}</p>
                    <p className="text-xs text-muted-foreground">From {sender?.name || 'Someone'} · {formatDistanceToNow(new Date(sg.created_at), { addSuffix: true })}</p>
                    {sg.message && <p className="text-xs italic mt-0.5 text-muted-foreground">"{sg.message}"</p>}
                  </div>
                  {!sg.read && <Badge variant="destructive" className="text-[10px]">New</Badge>}
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="sent" className="mt-4 space-y-2">
            {sentGifts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Gift className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No gifts sent yet</p>
              </div>
            ) : sentGifts.map(sg => {
              const gift = sg.gift as any;
              return (
                <div key={sg.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <span className="text-3xl">{gift?.emoji || '🎁'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{gift?.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(sg.created_at), { addSuffix: true })}</p>
                    {sg.message && <p className="text-xs italic mt-0.5 text-muted-foreground">"{sg.message}"</p>}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="dates" className="mt-4 space-y-3">
            {dates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No date proposals yet</p>
              </div>
            ) : dates.map(dp => {
              const isProposer = dp.proposer_id === userId;
              const otherPerson = isProposer ? (dp.recipient as any) : (dp.proposer as any);
              const isPending = dp.status === 'pending';
              const statusColors: Record<string, string> = {
                pending: 'bg-yellow-500/20 text-yellow-600',
                accepted: 'bg-green-500/20 text-green-600',
                declined: 'bg-red-500/20 text-red-600',
                cancelled: 'bg-muted text-muted-foreground',
              };

              return (
                <div key={dp.id} className="p-4 rounded-xl border border-border/50 bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{dp.activity}</span>
                    </div>
                    <Badge className={statusColors[dp.status] || ''} variant="secondary">
                      {dp.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>📅 {format(new Date(dp.proposed_date), 'PPP p')}</p>
                    {dp.location && <p>📍 {dp.location}</p>}
                    <p>{isProposer ? `To: ${otherPerson?.name || 'Someone'}` : `From: ${otherPerson?.name || 'Someone'}`}</p>
                    {dp.message && <p className="italic">"{dp.message}"</p>}
                  </div>
                  
                  {isPending && !isProposer && (
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => handleDateResponse(dp.id, 'accepted')} className="flex-1">
                        Accept ✓
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDateResponse(dp.id, 'declined')} className="flex-1">
                        Decline
                      </Button>
                    </div>
                  )}
                  {isPending && isProposer && (
                    <Button size="sm" variant="ghost" onClick={() => handleCancelDate(dp.id)} className="text-xs text-muted-foreground">
                      Cancel invitation
                    </Button>
                  )}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GiftsAndDatesPage;
