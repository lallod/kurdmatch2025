
import { useState, useEffect } from 'react';
import { getVerificationRequests, updateUserVerificationStatus } from '@/api/adminDatabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  documentType: string;
  submittedDate: string;
  status: 'pending' | 'verified' | 'rejected';
  priority: 'high' | 'medium' | 'normal';
  photoUrl?: string;
}

export const useVerificationData = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslations();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getVerificationRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching verification requests:', err);
      setError(t('verification.load_failed', 'Failed to load verification requests'));
      toast({ title: t('common.error', 'Error'), description: t('verification.load_failed', 'Failed to load verification requests'), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async (userId: string, action: 'verify' | 'reject') => {
    try {
      const verified = action === 'verify';
      await updateUserVerificationStatus(userId, verified);
      setRequests(prev => prev.map(req => req.userId === userId ? { ...req, status: verified ? 'verified' : 'rejected' } : req));
      toast({
        title: t('common.success', 'Success'),
        description: action === 'verify' 
          ? t('verification.user_verified', 'User verified successfully') 
          : t('verification.user_rejected', 'User rejected successfully'),
      });
    } catch (err) {
      console.error(`Error ${action}ing user:`, err);
      toast({
        title: t('common.error', 'Error'),
        description: action === 'verify' 
          ? t('verification.verify_failed', 'Failed to verify user') 
          : t('verification.reject_failed', 'Failed to reject user'),
        variant: "destructive"
      });
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  return { requests, loading, error, refetch: fetchRequests, handleVerificationAction };
};
