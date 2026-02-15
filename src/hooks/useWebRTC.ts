import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended' | 'failed';

interface UseWebRTCOptions {
  userId: string;
  onIncomingCall?: (callerId: string, callerName: string, callType: 'video' | 'voice', callId: string) => void;
}

export const useWebRTC = ({ userId, onIncomingCall }: UseWebRTCOptions) => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callType, setCallType] = useState<'video' | 'voice'>('video');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Listen for incoming calls via Supabase Realtime
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`calls-${userId}`)
      .on('broadcast', { event: 'incoming-call' }, (payload) => {
        const { callerId, callerName, callType: type, callId } = payload.payload;
        if (callStatus === 'idle') {
          setCurrentCallId(callId);
          setRemoteUserId(callerId);
          setCallType(type);
          setCallStatus('ringing');
          onIncomingCall?.(callerId, callerName, type, callId);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, callStatus, onIncomingCall]);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (localStream.current) {
      localStream.current.getTracks().forEach(t => t.stop());
      localStream.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    remoteStream.current = null;
    setCallDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
  }, []);

  const setupSignalingChannel = useCallback((callId: string) => {
    const channel = supabase.channel(`call-signal-${callId}`);

    channel
      .on('broadcast', { event: 'offer' }, async (payload) => {
        if (!peerConnection.current) return;
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.payload.sdp));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        channel.send({ type: 'broadcast', event: 'answer', payload: { sdp: answer } });
      })
      .on('broadcast', { event: 'answer' }, async (payload) => {
        if (!peerConnection.current) return;
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.payload.sdp));
      })
      .on('broadcast', { event: 'ice-candidate' }, async (payload) => {
        if (!peerConnection.current) return;
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(payload.payload.candidate));
        } catch (e) {
          // Ignore ICE candidate errors
        }
      })
      .on('broadcast', { event: 'hangup' }, () => {
        endCall();
      })
      .subscribe();

    channelRef.current = channel;
    return channel;
  }, []);

  const createPeerConnection = useCallback((channel: ReturnType<typeof supabase.channel>) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        channel.send({ type: 'broadcast', event: 'ice-candidate', payload: { candidate: event.candidate } });
      }
    };

    pc.ontrack = (event) => {
      remoteStream.current = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setCallStatus('connected');
        startTimer();
      } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        setCallStatus('failed');
        cleanup();
      }
    };

    peerConnection.current = pc;
    return pc;
  }, [cleanup]);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  }, []);

  const initiateCall = useCallback(async (targetUserId: string, type: 'video' | 'voice') => {
    try {
      setCallType(type);
      setCallStatus('calling');
      setRemoteUserId(targetUserId);

      // Create call record in DB
      const { data: call, error } = await supabase
        .from('calls')
        .insert({
          caller_id: userId,
          callee_id: targetUserId,
          call_type: type,
          status: 'ringing',
        })
        .select('id')
        .single();

      if (error || !call) throw error;
      setCurrentCallId(call.id);

      // Get local media
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: type === 'video',
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Setup signaling
      const channel = setupSignalingChannel(call.id);
      const pc = createPeerConnection(channel);

      // Add tracks
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for channel to be ready, then send
      setTimeout(() => {
        channel.send({ type: 'broadcast', event: 'offer', payload: { sdp: offer } });
      }, 500);

      // Notify callee via their personal channel
      const calleeChannel = supabase.channel(`calls-${targetUserId}`);
      calleeChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Fetch caller name
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', userId)
            .single();

          calleeChannel.send({
            type: 'broadcast',
            event: 'incoming-call',
            payload: {
              callerId: userId,
              callerName: profile?.name || 'Someone',
              callType: type,
              callId: call.id,
            },
          });

          // Clean up notification channel after sending
          setTimeout(() => supabase.removeChannel(calleeChannel), 2000);
        }
      });

    } catch (err) {
      console.error('Failed to initiate call:', err);
      setCallStatus('failed');
      cleanup();
    }
  }, [userId, setupSignalingChannel, createPeerConnection, cleanup]);

  const acceptCall = useCallback(async () => {
    if (!currentCallId) return;

    try {
      setCallStatus('connected');

      // Update call status in DB
      await supabase
        .from('calls')
        .update({ status: 'answered', started_at: new Date().toISOString() })
        .eq('id', currentCallId);

      // Get local media
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: callType === 'video',
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Setup signaling & peer connection
      const channel = setupSignalingChannel(currentCallId);
      const pc = createPeerConnection(channel);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

    } catch (err) {
      console.error('Failed to accept call:', err);
      setCallStatus('failed');
      cleanup();
    }
  }, [currentCallId, callType, setupSignalingChannel, createPeerConnection, cleanup]);

  const declineCall = useCallback(async () => {
    if (currentCallId) {
      await supabase
        .from('calls')
        .update({ status: 'declined', ended_at: new Date().toISOString() })
        .eq('id', currentCallId);

      if (channelRef.current) {
        channelRef.current.send({ type: 'broadcast', event: 'hangup', payload: {} });
      }
    }
    cleanup();
    setCallStatus('idle');
    setCurrentCallId(null);
    setRemoteUserId(null);
  }, [currentCallId, cleanup]);

  const endCall = useCallback(async () => {
    if (currentCallId) {
      await supabase
        .from('calls')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
          duration_seconds: callDuration,
        })
        .eq('id', currentCallId);

      if (channelRef.current) {
        channelRef.current.send({ type: 'broadcast', event: 'hangup', payload: {} });
      }
    }
    cleanup();
    setCallStatus('idle');
    setCurrentCallId(null);
    setRemoteUserId(null);
  }, [currentCallId, callDuration, cleanup]);

  const toggleMute = useCallback(() => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(prev => !prev);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(prev => !prev);
    }
  }, []);

  return {
    callStatus,
    callType,
    callDuration,
    isMuted,
    isCameraOff,
    currentCallId,
    remoteUserId,
    localVideoRef,
    remoteVideoRef,
    initiateCall,
    acceptCall,
    declineCall,
    endCall,
    toggleMute,
    toggleCamera,
  };
};
