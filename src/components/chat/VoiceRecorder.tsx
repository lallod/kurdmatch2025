import { Mic, Square, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useEffect } from 'react';

interface VoiceRecorderProps {
  onSendVoice: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
}

export const VoiceRecorder = ({ onSendVoice, onCancel }: VoiceRecorderProps) => {
  const {
    isRecording,
    duration,
    audioBlob,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useVoiceRecorder();

  useEffect(() => {
    // Auto-start recording when component mounts
    startRecording().catch((error) => {
      console.error('Failed to start recording:', error);
      onCancel();
    });

    return () => {
      cancelRecording();
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (audioBlob) {
      onSendVoice(audioBlob, duration);
    }
  };

  const handleCancel = () => {
    cancelRecording();
    onCancel();
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
      <div className="flex items-center gap-2 flex-1">
        <div className="relative">
          <Mic className="h-5 w-5 text-red-500" />
          {isRecording && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
        <span className="text-sm font-medium text-red-500">
          {formatDuration(duration)}
        </span>
        <div className="flex-1 h-8 flex items-center gap-0.5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-red-500/30 rounded-full"
              style={{
                height: `${Math.random() * 100}%`,
                animation: isRecording ? `pulse ${0.5 + Math.random()}s ease-in-out infinite` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="text-red-500 hover:bg-red-500/10"
        >
          <X className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={isRecording ? stopRecording : undefined}
          className="text-red-500 hover:bg-red-500/10"
        >
          <Square className="h-4 w-4" />
        </Button>

        {audioBlob && !isRecording && (
          <Button
            size="icon"
            onClick={handleSend}
            className="bg-red-500 hover:bg-red-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
