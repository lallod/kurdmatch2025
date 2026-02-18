import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Share2, Copy, Facebook, Twitter, Mail, Link2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface SharePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postContent: string;
}

export const SharePostDialog: React.FC<SharePostDialogProps> = ({
  open,
  onOpenChange,
  postId,
  postContent,
}) => {
  const { t } = useTranslations();
  const shareUrl = `${window.location.origin}/post/${postId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success(t('toast.share.link_copied', 'Link copied to clipboard'));
  };

  const handleShareVia = (platform: string) => {
    let url = '';
    const text = postContent.substring(0, 100) + '...';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=Check out this post&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Copy Link */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleCopyLink}
          >
            <Copy className="w-5 h-5" />
            Copy Link
          </Button>

          {/* WhatsApp */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShareVia('whatsapp')}
          >
            <MessageCircle className="w-5 h-5 text-green-500" />
            Share via WhatsApp
          </Button>

          {/* Facebook */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShareVia('facebook')}
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            Share on Facebook
          </Button>

          {/* Twitter */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShareVia('twitter')}
          >
            <Twitter className="w-5 h-5 text-sky-500" />
            Share on Twitter
          </Button>

          {/* Email */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleShareVia('email')}
          >
            <Mail className="w-5 h-5" />
            Share via Email
          </Button>
        </div>

        {/* Share URL Display */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Post URL:</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background px-3 py-2 rounded border text-sm truncate">
              {shareUrl}
            </div>
            <Button size="sm" variant="ghost" onClick={handleCopyLink}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
