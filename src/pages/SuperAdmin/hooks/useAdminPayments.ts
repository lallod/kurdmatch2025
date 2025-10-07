import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminPayment {
  id: string;
  user_id: string;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  subscription_type: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    name: string;
    profile_image: string;
  };
}

export const useAdminPayments = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
  });

  const fetchPayments = async (page: number = 1, limit: number = 10, statusFilter: string = 'all') => {
    try {
      setLoading(true);

      // Build count query
      let countQuery = supabase
        .from('payments')
        .select('*', { count: 'exact', head: true });

      if (statusFilter !== 'all') {
        countQuery = countQuery.eq('status', statusFilter);
      }

      const { count } = await countQuery;
      setTotalCount(count || 0);

      // Build main query
      let query = supabase
        .from('payments')
        .select(`
          id,
          user_id,
          stripe_payment_intent_id,
          stripe_customer_id,
          amount,
          currency,
          status,
          payment_method,
          subscription_type,
          description,
          created_at,
          updated_at,
          profile:profiles(name, profile_image)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data
      const transformedPayments = (data || []).map((payment: any) => ({
        id: payment.id,
        user_id: payment.user_id,
        stripe_payment_intent_id: payment.stripe_payment_intent_id,
        stripe_customer_id: payment.stripe_customer_id,
        amount: Number(payment.amount),
        currency: payment.currency,
        status: payment.status,
        payment_method: payment.payment_method,
        subscription_type: payment.subscription_type,
        description: payment.description,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
        profile: Array.isArray(payment.profile) ? payment.profile[0] : payment.profile,
      }));

      setPayments(transformedPayments);

      // Fetch stats
      await fetchStats();
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get all payments for stats
      const { data: allPayments } = await supabase
        .from('payments')
        .select('amount, status');

      const completedPayments = allPayments?.filter(p => p.status === 'completed') || [];
      const totalRevenue = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);

      setStats({
        totalRevenue,
        completedPayments: completedPayments.length,
        pendingPayments: allPayments?.filter(p => p.status === 'pending').length || 0,
        failedPayments: allPayments?.filter(p => p.status === 'failed').length || 0,
      });
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  const refundPayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'refunded', updated_at: new Date().toISOString() })
        .eq('id', paymentId);

      if (error) throw error;

      // Refresh data
      await fetchPayments();
      return true;
    } catch (error) {
      console.error('Error refunding payment:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    totalCount,
    stats,
    fetchPayments,
    refundPayment,
  };
};
