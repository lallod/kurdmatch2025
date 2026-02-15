import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface IncomingCallSheetProps {
  open: boolean;
  callerId: string;
  callerName: string;
  callType: 'video' | 'voice';
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallSheet: React.FC<IncomingCallSheetProps> = ({
  open,
  callerId,
  callerName,
  callType,
  onAccept,
  onDecline,
}) => {
  const [callerAvatar, setCallerAvatar] = useState('');

  useEffect(() => {
    if (callerId) {
      supabase
        .from('profiles')
        .select('profile_image')
        .eq('id', callerId)
        .single()
        .then(({ data }) => {
          if (data?.profile_image) setCallerAvatar(data.profile_image);
        });
    }
  }, [callerId]);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onDecline(); }}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-background pb-10">
        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-6 mt-2" />
        
        <div className="flex flex-col items-center gap-4 py-6">
          {/* Animated ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute -inset-2 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2.5s' }} />
            <Avatar className="h-24 w-24 ring-4 ring-primary/30 relative z-10">
              <AvatarImage src={callerAvatar} alt={callerName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {callerName?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="text-center mt-2">
            <h3 className="text-xl font-bold text-foreground">{callerName}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Incoming {callType === 'video' ? 'video' : 'voice'} call...
            </p>
          </div>

          <div className="flex items-center gap-8 mt-6">
            {/* Decline */}
            <div className="flex flex-col items-center gap-2">
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
                onClick={onDecline}
                aria-label="Decline call"
              >
                <PhoneOff className="h-7 w-7" />
              </Button>
              <span className="text-xs text-muted-foreground">Decline</span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center gap-2">
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
                onClick={onAccept}
                aria-label="Accept call"
              >
                {callType === 'video' ? <Video className="h-7 w-7" /> : <Phone className="h-7 w-7" />}
              </Button>
              <span className="text-xs text-muted-foreground">Accept</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default IncomingCallSheet;
