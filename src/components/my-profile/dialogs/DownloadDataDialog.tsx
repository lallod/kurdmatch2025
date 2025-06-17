
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, Shield, Clock } from 'lucide-react';
import { downloadUserData } from '@/api/accountActions';
import { toast } from 'sonner';

interface DownloadDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DownloadDataDialog: React.FC<DownloadDataDialogProps> = ({ open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    setIsLoading(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const userData = await downloadUserData();
      
      clearInterval(progressInterval);
      setProgress(100);

      // Create downloadable file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Your data has been downloaded successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download your data. Please try again.');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Download className="w-5 h-5 mr-2 text-purple-400" />
            Download My Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-blue-400" />
                What's Included
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Profile information and photos</li>
                <li>• Match history and conversations</li>
                <li>• Likes given and received</li>
                <li>• Connected social accounts</li>
                <li>• Account activity data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-300 font-medium mb-1">Privacy & Security</h4>
                  <p className="text-sm text-blue-200">
                    Your data is exported securely and includes only information associated with your account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Preparing your data...</span>
                <span className="text-purple-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? 'Preparing...' : 'Download'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDataDialog;
