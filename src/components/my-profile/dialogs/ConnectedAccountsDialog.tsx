
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Trash2, Instagram, Camera, Share } from 'lucide-react';
import { getConnectedAccounts, connectSocialAccount, disconnectSocialAccount } from '@/api/accountActions';
import { ConnectedSocialAccount } from '@/types/account';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface ConnectedAccountsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConnectedAccountsDialog: React.FC<ConnectedAccountsDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslations();
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedSocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState<'instagram' | 'snapchat' | null>(null);
  const [formData, setFormData] = useState({ username: '', userId: '' });

  useEffect(() => {
    if (open) {
      loadConnectedAccounts();
    }
  }, [open]);

  const loadConnectedAccounts = async () => {
    try {
      const accounts = await getConnectedAccounts();
      setConnectedAccounts(accounts);
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
      toast.error(t('toast.accounts.load_failed', 'Failed to load connected accounts'));
    }
  };

  const handleConnect = async (platform: 'instagram' | 'snapchat') => {
    if (!formData.username.trim()) {
      toast.error(t('toast.accounts.enter_username', 'Please enter a username'));
      return;
    }

    setIsLoading(true);
    try {
      await connectSocialAccount(platform, formData.username, formData.userId || formData.username);
      toast.success(`${platform} account connected successfully!`);
      setFormData({ username: '', userId: '' });
      setShowAddForm(null);
      loadConnectedAccounts();
    } catch (error) {
      console.error('Connection error:', error);
      toast.error(`Failed to connect ${platform} account`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (accountId: string, platform: string) => {
    setIsLoading(true);
    try {
      await disconnectSocialAccount(accountId);
      toast.success(`${platform} account disconnected`);
      loadConnectedAccounts();
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error(`Failed to disconnect ${platform} account`);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'snapchat':
        return <Camera className="w-5 h-5 text-yellow-500" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const generateShareableLink = (platform: string, username: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/profile/share?${platform}=${username}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Globe className="w-5 h-5 mr-2 text-purple-400" />
            Connected Accounts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Connected Accounts List */}
          <div className="space-y-3">
            {connectedAccounts.length > 0 ? (
              connectedAccounts.map((account) => (
                <Card key={account.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(account.platform)}
                        <div>
                          <p className="text-white font-medium capitalize">
                            {account.platform}
                          </p>
                          <p className="text-sm text-gray-400">@{account.username}</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {account.platform === 'snapchat' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-yellow-500/10 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20"
                            onClick={() => {
                              const link = generateShareableLink(account.platform, account.username);
                              navigator.clipboard.writeText(link);
                              toast.success(t('toast.accounts.link_copied', 'Shareable link copied!'));
                            }}
                          >
                            <Share className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-400/30 hover:bg-red-500/10"
                          onClick={() => handleDisconnect(account.id, account.platform)}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Globe className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">No connected accounts</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Add Account Forms */}
          {showAddForm && (
            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  {getPlatformIcon(showAddForm)}
                  <span className="ml-2 capitalize">Connect {showAddForm}</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-purple-200">Username</Label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder={`Your ${showAddForm} username`}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(null)}
                      className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleConnect(showAddForm)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      disabled={isLoading}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Account Buttons */}
          {!showAddForm && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Add New Account</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm('instagram')}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  disabled={connectedAccounts.some(acc => acc.platform === 'instagram')}
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm('snapchat')}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  disabled={connectedAccounts.some(acc => acc.platform === 'snapchat')}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Snapchat
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-700">
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectedAccountsDialog;
