import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Gift, Plus, Edit, Loader2, Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';
import { executeAdminAction } from '@/utils/admin/auditLogger';

interface VirtualGift {
  id: string;
  name: string;
  emoji: string;
  description: string | null;
  price_coins: number;
  category: string;
  is_premium: boolean;
  active: boolean;
  sort_order: number;
}

const CATEGORIES = ['romantic', 'casual', 'compliment', 'fun', 'nature', 'luxury'];

const VirtualGiftsPage = () => {
  const { t } = useTranslations();
  const [gifts, setGifts] = useState<VirtualGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [editGift, setEditGift] = useState<Partial<VirtualGift> | null>(null);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadGifts = async () => {
    const { data, error } = await supabase.from('virtual_gifts').select('*').order('sort_order');
    if (error) { console.error(error); return; }
    setGifts(data as VirtualGift[]);
    setLoading(false);
  };

  useEffect(() => { loadGifts(); }, []);

  const handleSave = async () => {
    if (!editGift?.name || !editGift?.emoji) { toast.error(t('admin.name_emoji_required', 'Name and emoji are required')); return; }
    setSaving(true);
    try {
      if (editGift.id) {
        const { error } = await supabase.from('virtual_gifts').update({ name: editGift.name, emoji: editGift.emoji, description: editGift.description, price_coins: editGift.price_coins, category: editGift.category, is_premium: editGift.is_premium, active: editGift.active, sort_order: editGift.sort_order }).eq('id', editGift.id);
        if (error) throw error;
        toast.success(t('admin.gift_updated', 'Gift updated'));
      } else {
        const { error } = await supabase.from('virtual_gifts').insert({ name: editGift.name!, emoji: editGift.emoji!, description: editGift.description, price_coins: editGift.price_coins || 0, category: editGift.category || 'general', is_premium: editGift.is_premium || false, active: editGift.active !== false, sort_order: editGift.sort_order || 0 });
        if (error) throw error;
        toast.success(t('admin.gift_created', 'Gift created'));
      }
      setDialogOpen(false); setEditGift(null); loadGifts();
    } catch (err: any) { toast.error(err.message || t('admin.save_failed', 'Failed to save')); } finally { setSaving(false); }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await executeAdminAction({ action: 'toggle_flag', table: 'virtual_gifts', recordId: id, data: { active: !active } });
      setGifts(prev => prev.map(g => g.id === id ? { ...g, active: !active } : g));
    } catch (error) {
      console.error('Error toggling gift:', error);
      toast.error('Failed to toggle gift');
    }
  };

  const openCreate = () => { setEditGift({ name: '', emoji: '🎁', description: '', price_coins: 10, category: 'general', is_premium: false, active: true, sort_order: gifts.length + 1 }); setDialogOpen(true); };
  const openEdit = (gift: VirtualGift) => { setEditGift({ ...gift }); setDialogOpen(true); };

  const totalGifts = gifts.length;
  const activeGifts = gifts.filter(g => g.active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.virtual_gifts', 'Virtual Gifts')}</h1>
          <p className="text-white/60 mt-1">{t('admin.active_total_gifts', '{{active}} active · {{total}} total gifts', { active: activeGifts, total: totalGifts })}</p>
        </div>
        <Button onClick={openCreate} className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
          <Plus className="h-4 w-4 mr-2" /> {t('admin.add_gift', 'Add Gift')}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-white/40" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {gifts.map(gift => (
            <Card key={gift.id} className={`bg-[#1a1a1a] border-white/10 ${!gift.active ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{gift.emoji}</span>
                    <div>
                      <p className="text-white font-medium flex items-center gap-2">
                        {gift.name}
                        {gift.is_premium && <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">{t('admin.premium_only', 'Premium')}</Badge>}
                      </p>
                      <div className="flex items-center gap-1 text-white/50 text-xs">
                        <Coins className="h-3 w-3" /> {gift.price_coins} coins · {gift.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={gift.active} onCheckedChange={() => toggleActive(gift.id, gift.active)} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white" onClick={() => openEdit(gift)}><Edit className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editGift?.id ? t('admin.edit_gift', 'Edit Gift') : t('admin.create_gift', 'Create Gift')}</DialogTitle>
          </DialogHeader>
          {editGift && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/70 text-sm">{t('admin.emoji', 'Emoji')}</Label><Input value={editGift.emoji || ''} onChange={e => setEditGift(p => ({ ...p, emoji: e.target.value }))} className="bg-[#0f0f0f] border-white/10 text-white text-2xl text-center" maxLength={4} /></div>
                <div><Label className="text-white/70 text-sm">{t('common.name', 'Name')}</Label><Input value={editGift.name || ''} onChange={e => setEditGift(p => ({ ...p, name: e.target.value }))} className="bg-[#0f0f0f] border-white/10 text-white" /></div>
              </div>
              <div><Label className="text-white/70 text-sm">{t('admin.description', 'Description')}</Label><Input value={editGift.description || ''} onChange={e => setEditGift(p => ({ ...p, description: e.target.value }))} className="bg-[#0f0f0f] border-white/10 text-white" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label className="text-white/70 text-sm">{t('admin.price_coins', 'Price (coins)')}</Label><Input type="number" value={editGift.price_coins || 0} onChange={e => setEditGift(p => ({ ...p, price_coins: parseInt(e.target.value) || 0 }))} className="bg-[#0f0f0f] border-white/10 text-white" /></div>
                <div><Label className="text-white/70 text-sm">{t('admin.category', 'Category')}</Label>
                  <Select value={editGift.category || 'general'} onValueChange={v => setEditGift(p => ({ ...p, category: v }))}>
                    <SelectTrigger className="bg-[#0f0f0f] border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-white/70 text-sm">{t('admin.sort_order', 'Sort Order')}</Label><Input type="number" value={editGift.sort_order || 0} onChange={e => setEditGift(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="bg-[#0f0f0f] border-white/10 text-white" /></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><Switch checked={editGift.is_premium || false} onCheckedChange={v => setEditGift(p => ({ ...p, is_premium: v }))} /><Label className="text-white/70 text-sm">{t('admin.premium_only', 'Premium only')}</Label></div>
                <div className="flex items-center gap-2"><Switch checked={editGift.active !== false} onCheckedChange={v => setEditGift(p => ({ ...p, active: v }))} /><Label className="text-white/70 text-sm">{t('admin.active', 'Active')}</Label></div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-red-500 to-orange-500">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editGift.id ? t('admin.update_gift', 'Update Gift') : t('admin.create_gift', 'Create Gift')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VirtualGiftsPage;
