import React, { useState, useEffect } from 'react';
import { getConversations } from '@/api/messages';
import { getMatches } from '@/api/matches';
import { getStories } from '@/api/posts';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';
import LoadingState from '@/components/LoadingState';
import ConversationList from '@/components/messages/ConversationList';
import ChatView from '@/components/messages/ChatView';
import { useWebRTC } from '@/hooks/useWebRTC';
import VideoCallScreen from '@/components/calls/VideoCallScreen';
import IncomingCallSheet from '@/components/calls/IncomingCallSheet';

const Messages = () => {
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [matchStories, setMatchStories] = useState<Map<string, any[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Call state
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCallerName, setIncomingCallerName] = useState('');
  const [showCallScreen, setShowCallScreen] = useState(false);

  const {
    callStatus, callType, callDuration, isMuted, isCameraOff,
    remoteUserId, localVideoRef, remoteVideoRef,
    initiateCall, acceptCall, declineCall, endCall, toggleMute, toggleCamera,
  } = useWebRTC({
    userId: user?.id || '',
    onIncomingCall: (_callerId, callerName) => {
      setIncomingCallerName(callerName);
      setShowIncomingCall(true);
    },
  });

  const loadData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const [conversationsData, matchesData, storiesData] = await Promise.all([
        getConversations(),
        getMatches(),
        getStories(),
      ]);
      setConversations(conversationsData);
      setAllMatches(matchesData);
      
      // Group stories by user ID for quick lookup
      const storyMap = new Map<string, any[]>();
      storiesData.forEach((story: any) => {
        const userId = story.user_id;
        if (!storyMap.has(userId)) storyMap.set(userId, []);
        storyMap.get(userId)!.push(story);
      });
      setMatchStories(storyMap);
    } catch {
      toast.error(t('toast.messages.load_failed', 'Failed to load messages'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (!user) return;
    const channel = supabase
      .channel('conversations-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `recipient_id=eq.${user.id}` }, () => {
        // Only refresh the conversation list when not in a chat view
        // to prevent re-render loops with edge function calls
        if (!selectedConversation) {
          loadData();
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, selectedConversation]);

  // Auto-open conversation from query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    if (userParam) setSelectedConversation(userParam);
  }, []);

  if (isLoading) return <LoadingState />;

  const handleInitiateCall = (userId: string, type: 'voice' | 'video') => {
    initiateCall(userId, type);
    setShowCallScreen(true);
  };

  const conversation = selectedConversation ? conversations.find(c => c.id === selectedConversation) : null;

  return (
    <>
      {conversation ? (
        <ChatView
          conversation={conversation}
          onBack={() => setSelectedConversation(null)}
          onConversationsRefresh={loadData}
          onInitiateCall={handleInitiateCall}
        />
      ) : (
        <div className="min-h-screen bg-background flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
            <ConversationList
              conversations={conversations}
              allMatches={allMatches}
              matchStories={matchStories}
              onSelectConversation={setSelectedConversation}
            />
          </div>
        </div>
      )}

      {/* Call screen */}
      {showCallScreen && callStatus !== 'idle' && (
        <VideoCallScreen
          callStatus={callStatus}
          callType={callType}
          callDuration={callDuration}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          remoteUserId={remoteUserId}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onEndCall={() => { endCall(); setShowCallScreen(false); }}
          onToggleMute={toggleMute}
          onToggleCamera={toggleCamera}
          onMinimize={() => setShowCallScreen(false)}
        />
      )}

      <IncomingCallSheet
        open={showIncomingCall && callStatus === 'ringing'}
        callerId={remoteUserId || ''}
        callerName={incomingCallerName}
        callType={callType}
        onAccept={() => { acceptCall(); setShowIncomingCall(false); setShowCallScreen(true); }}
        onDecline={() => { declineCall(); setShowIncomingCall(false); }}
      />
    </>
  );
};

export default Messages;
