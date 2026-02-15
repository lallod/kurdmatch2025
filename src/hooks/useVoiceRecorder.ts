import { useState, useRef, useCallback } from 'react';

const MAX_RECORDING_DURATION = 5 * 60; // 5 minutes in seconds

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  const stopRecordingInternal = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Detect best supported MIME type (Safari doesn't support webm)
      const supportedTypes = ['audio/webm', 'audio/mp4', 'audio/ogg'];
      const mimeType = supportedTypes.find(t => MediaRecorder.isTypeSupported(t));
      
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        // Enforce 5MB max size for voice messages
        if (blob.size > 5 * 1024 * 1024) {
          setAudioBlob(null);
          return;
        }
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setDuration(0);

      // Start duration timer with auto-stop at max duration
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const next = prev + 1;
          if (next >= MAX_RECORDING_DURATION) {
            stopRecordingInternal();
          }
          return next;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }, [stopRecordingInternal]);

  const stopRecording = useCallback(() => {
    stopRecordingInternal();
  }, [stopRecordingInternal]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setAudioBlob(null);
      setDuration(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, []);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setDuration(0);
  }, []);

  const remainingTime = MAX_RECORDING_DURATION - duration;

  return {
    isRecording,
    duration,
    audioBlob,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
    maxDuration: MAX_RECORDING_DURATION,
    remainingTime,
  };
};
