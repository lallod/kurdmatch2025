
import { useState, useEffect } from 'react';
import { getVerificationRequests, updateUserVerificationStatus } from '@/api/adminDatabase';
import { useToast } from '@/hooks/use-toast';

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

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getVerificationRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching verification requests:', err);
      setError('Failed to load verification requests');
      toast({
        title: "Error",
        description: "Failed to load verification requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async (userId: string, action: 'verify' | 'reject') => {
    try {
      const verified = action === 'verify';
      await updateUserVerificationStatus(userId, verified);
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req.userId === userId 
          ? { ...req, status: verified ? 'verified' : 'rejected' }
          : req
      ));

      toast({
        title: "Success",
        description: `User ${action === 'verify' ? 'verified' : 'rejected'} successfully`,
      });
    } catch (err) {
      console.error(`Error ${action}ing user:`, err);
      toast({
        title: "Error",
        description: `Failed to ${action} user`,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    handleVerificationAction
  };
};
