import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Camera, Check, X, Loader2, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useVideoVerification } from '@/hooks/useVideoVerification';
import { cn } from '@/lib/utils';

interface VideoVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'intro' | 'recording' | 'preview' | 'uploading' | 'success';

const instructions = [
  "Look directly at the camera",
  "Turn your head slowly to the left",
  "Turn your head slowly to the right", 
  "Smile naturally",
  "Hold still for 2 seconds"
];

export const VideoVerificationDialog = ({ open, onOpenChange }: VideoVerificationDialogProps) => {
  const [step, setStep] = useState<Step>('intro');
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const { submitVerification, isUploading } = useVideoVerification();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 720 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStep('recording');
      startRecording();
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp8'
    });
    
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedVideo(blob);
      setRecordedUrl(URL.createObjectURL(blob));
      setStep('preview');
    };
    
    mediaRecorder.start();
    
    // Cycle through instructions
    let instructionIndex = 0;
    const instructionInterval = setInterval(() => {
      instructionIndex++;
      if (instructionIndex >= instructions.length) {
        clearInterval(instructionInterval);
        setTimeout(() => {
          mediaRecorder.stop();
          stopCamera();
        }, 2000);
      } else {
        setCurrentInstruction(instructionIndex);
        setProgress((instructionIndex / instructions.length) * 100);
      }
    }, 3000);
    
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleSubmit = async () => {
    if (!recordedVideo) return;
    
    setStep('uploading');
    const file = new File([recordedVideo], 'verification.webm', { type: 'video/webm' });
    const result = await submitVerification(file);
    
    if (result) {
      setStep('success');
      setTimeout(() => {
        onOpenChange(false);
        resetState();
      }, 3000);
    } else {
      setStep('preview');
    }
  };

  const handleRetake = () => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedVideo(null);
    setRecordedUrl(null);
    setCurrentInstruction(0);
    setProgress(0);
    startCamera();
  };

  const resetState = () => {
    setStep('intro');
    setCurrentInstruction(0);
    setProgress(0);
    setRecordedVideo(null);
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedUrl(null);
    stopCamera();
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-900 to-pink-900 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Video Verification
          </DialogTitle>
          <DialogDescription className="text-purple-200">
            Verify your identity to get the trusted badge
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-square bg-black/50 rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Quick Video Selfie
                </h3>
                <p className="text-sm text-purple-200 mb-6">
                  Record a short video following simple prompts to verify you're real.
                  This protects you and others from fake profiles.
                </p>
                <ul className="text-left text-sm text-purple-300 space-y-1 mb-6">
                  {instructions.map((inst, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-xs">
                        {i + 1}
                      </span>
                      {inst}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={startCamera}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Verification
                </Button>
              </motion.div>
            )}

            {step === 'recording' && (
              <motion.div
                key="recording"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <Progress value={progress} className="mb-3" />
                  <motion.p
                    key={currentInstruction}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-white font-medium"
                  >
                    {instructions[currentInstruction]}
                  </motion.p>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-white text-sm font-medium">REC</span>
                </div>
              </motion.div>
            )}

            {step === 'preview' && recordedUrl && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <video
                  src={recordedUrl}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRetake}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Submit
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'uploading' && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <Loader2 className="w-12 h-12 animate-spin text-purple-400 mb-4" />
                <p className="text-white font-medium">Uploading verification...</p>
                <p className="text-sm text-purple-300">Please don't close this window</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Verification Submitted!
                </h3>
                <p className="text-sm text-purple-200 text-center px-6">
                  We'll review your video within 24 hours. You'll get a notification when approved.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
