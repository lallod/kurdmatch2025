import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Brain, Search, Calendar, MessageSquare, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';

interface AIInsight {
  id: string;
  user_id: string;
  conversation_partner_id: string;
  conversation_summary: string;
  communication_style: string;
  shared_interests: any;
  suggested_topics: any;
  created_at: string;
  last_updated: string;
}

const AIInsightsPage = () => {
  const { t } = useTranslations();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('ai_conversation_insights')
        .select('*', { count: 'exact' })
        .order('last_updated', { ascending: false })
        .limit(100);
      if (error) throw error;
      setInsights(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      toast.error(t('admin.failed_load_ai_insights', 'Failed to load AI insights'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInsights(); }, []);

  const filteredInsights = insights.filter(insight => {
    const search = searchTerm.toLowerCase();
    return insight.user_id.toLowerCase().includes(search) || 
           insight.conversation_partner_id.toLowerCase().includes(search) ||
           (insight.conversation_summary && insight.conversation_summary.toLowerCase().includes(search));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.ai_insights', 'AI Conversation Insights')}</h1>
          <p className="text-white/60 mt-1">{t('admin.ai_insights_desc', 'View AI-generated conversation analysis')} ({totalCount} insights)</p>
        </div>
        <Button onClick={fetchInsights} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          {t('admin.refresh', 'Refresh')}
        </Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            {t('admin.all_ai_insights', 'All AI Insights')}
          </CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input placeholder={t('admin.search_insights', 'Search insights...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading_insights', 'Loading AI insights...')}</div>
          ) : filteredInsights.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_insights_found', 'No AI insights found')}</div>
          ) : (
            <div className="space-y-4">
              {filteredInsights.map((insight) => (
                <div key={insight.id} className="p-5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-white font-mono text-sm">User: {insight.user_id.substring(0, 10)}...</p>
                        <MessageSquare className="h-4 w-4 text-white/40" />
                        <p className="text-white font-mono text-sm">Partner: {insight.conversation_partner_id.substring(0, 10)}...</p>
                      </div>
                      {insight.conversation_summary && (
                        <div className="mb-3"><p className="text-white/80 text-sm leading-relaxed">{insight.conversation_summary}</p></div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        {insight.communication_style && (
                          <div className="p-3 bg-white/5 rounded-lg">
                            <p className="text-white/60 text-xs mb-1">{t('admin.communication_style', 'Communication Style')}</p>
                            <p className="text-white text-sm font-medium">{insight.communication_style}</p>
                          </div>
                        )}
                        {insight.shared_interests && Array.isArray(insight.shared_interests) && insight.shared_interests.length > 0 && (
                          <div className="p-3 bg-white/5 rounded-lg">
                            <p className="text-white/60 text-xs mb-2">{t('admin.shared_interests', 'Shared Interests')}</p>
                            <div className="flex flex-wrap gap-1">
                              {insight.shared_interests.map((interest, idx) => (
                                <Badge key={idx} variant="outline" className="bg-green-500/10 border-green-500/20 text-green-500 text-xs">
                                  {typeof interest === 'string' ? interest : JSON.stringify(interest)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {insight.suggested_topics && Array.isArray(insight.suggested_topics) && insight.suggested_topics.length > 0 && (
                        <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-blue-500" />
                            <p className="text-blue-500 text-xs font-medium">{t('admin.suggested_topics', 'Suggested Topics')}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {insight.suggested_topics.map((topic, idx) => (
                              <Badge key={idx} variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-500 text-xs">
                                {typeof topic === 'string' ? topic : JSON.stringify(topic)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {format(new Date(insight.created_at), 'MMM d, yyyy')}
                        </Badge>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          Updated: {format(new Date(insight.last_updated), 'MMM d, HH:mm')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsPage;
