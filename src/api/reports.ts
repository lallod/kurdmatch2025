import { supabase } from '@/integrations/supabase/client';
import { fromUntyped } from '@/integrations/supabase/untypedClient';
import { sanitizeText } from '@/utils/security/inputValidation';

export interface CreateReportInput {
  reported_user_id: string;
  reason: string;
  details?: string;
  context?: Record<string, any>;
}

const MAX_REASON_LENGTH = 200;
const MAX_DETAILS_LENGTH = 2000;

export const createReport = async (payload: CreateReportInput) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  if (user.id === payload.reported_user_id) throw new Error('Cannot report yourself');

  const reason = sanitizeText(payload.reason).substring(0, MAX_REASON_LENGTH);
  if (!reason || reason.length === 0) throw new Error('Reason is required');

  const details = payload.details ? sanitizeText(payload.details).substring(0, MAX_DETAILS_LENGTH) : null;

  const { data, error } = await fromUntyped('reports')
    .from('reports')
    .insert({
      reporter_user_id: user.id,
      reported_user_id: payload.reported_user_id,
      reason,
      details,
      context: payload.context ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as any;
};
