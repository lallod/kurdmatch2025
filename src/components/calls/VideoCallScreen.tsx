import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Minimize2 } from 'lucide-react';
import { CallStatus } from '@/hooks/useWebRTC';
import { supabase } from '@/integrations/supabase/client';

interface VideoCallScreenProps {
  callStatus: CallStatus;
  callType: 'video' | 'voice';
  callDuration: number;
  isMuted: boolean;
  isCameraOff: boolean;
  remoteUserId: string | null;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onMinimize?: () => void;
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const VideoCallScreen: React.FC<VideoCallScreenProps> = ({
  callStatus,
  callType,
  callDuration,
  isMuted,
  isCameraOff,
  remoteUserId,
  localVideoRef,
  remoteVideoRef,
  onEndCall,
  onToggleMute,
  onToggleCamera,
  onMinimize,
}) => {
  const [remoteName, setRemoteName] = useState('');
  const [remoteAvatar, setRemoteAvatar] = useState('');

  useEffect(() => {
    if (remoteUserId) {
      supabase
        .from('profiles')
        .select('name, profile_image')
        .eq('id', remoteUserId)
        .single()
        .then(({ data }) => {
          if (data) {
            setRemoteName(data.name || 'Unknown');
            setRemoteAvatar(data.profile_image || '');
          }
        });
    }
  }, [remoteUserId]);

  const statusText = {
    calling: 'Calling...',
    ringing: 'Ringing...',
    connected: formatDuration(callDuration),
    ended: 'Call ended',
    failed: 'Call failed',
    idle: '',
  }[callStatus];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Remote video / avatar background */}
      <div className="flex-1 relative bg-muted flex items-center justify-center overflow-hidden">
        {callType === 'video' && callStatus === 'connected' ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-28 w-28 ring-4 ring-primary/30">
              <AvatarImage src={remoteAvatar} alt={remoteName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                {remoteName?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-foreground">{remoteName}</h2>
            <p className="text-muted-foreground text-sm animate-pulse">{statusText}</p>
          </div>
        )}

        {/* Local video (PiP) */}
        {callType === 'video' && callStatus === 'connected' && (
          <div className="absolute top-4 right-4 w-28 h-40 rounded-2xl overflow-hidden shadow-2xl border-2 border-background">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isCameraOff ? 'hidden' : ''}`}
            />
            {isCameraOff && (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <VideoOff className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        )}

        {/* Status overlay for connected video calls */}
        {callStatus === 'connected' && callType === 'video' && (
          <div className="absolute top-4 left-4 bg-background/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-foreground">{statusText}</span>
          </div>
        )}

        {/* Minimize button */}
        {onMinimize && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-foreground bg-background/40 backdrop-blur-sm rounded-full"
            onClick={onMinimize}
            aria-label="Minimize call"
          >
            <Minimize2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-background border-t border-border px-6 py-6 safe-area-bottom">
        <div className="flex items-center justify-center gap-6">
          {/* Mute */}
          <Button
            variant="outline"
            size="icon"
            className={`h-14 w-14 rounded-full ${isMuted ? 'bg-destructive/15 border-destructive/30 text-destructive' : 'bg-muted'}`}
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          {/* End call */}
          <Button
            size="icon"
            className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
            onClick={onEndCall}
            aria-label="End call"
          >
            <PhoneOff className="h-7 w-7" />
          </Button>

          {/* Camera toggle (video calls only) */}
          {callType === 'video' && (
            <Button
              variant="outline"
              size="icon"
              className={`h-14 w-14 rounded-full ${isCameraOff ? 'bg-destructive/15 border-destructive/30 text-destructive' : 'bg-muted'}`}
              onClick={onToggleCamera}
              aria-label={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {isCameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallScreen;
