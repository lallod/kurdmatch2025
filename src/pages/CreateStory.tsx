import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Camera, Image as ImageIcon, Type, X, Palette, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import browserImageCompression from 'browser-image-compression';

const TEXT_POSITIONS = [
  { id: 'top', label: 'Top', className: 'top-12 left-4 right-4' },
  { id: 'center', label: 'Center', className: 'top-1/2 left-4 right-4 -translate-y-1/2' },
  { id: 'bottom', label: 'Bottom', className: 'bottom-20 left-4 right-4' },
] as const;

const BG_GRADIENTS = [
  { id: 'sunset', bg: 'from-rose-500 via-orange-400 to-amber-300' },
  { id: 'ocean', bg: 'from-blue-600 via-cyan-400 to-teal-300' },
  { id: 'forest', bg: 'from-emerald-600 via-green-400 to-lime-300' },
  { id: 'night', bg: 'from-indigo-900 via-purple-700 to-pink-500' },
  { id: 'fire', bg: 'from-red-600 via-orange-500 to-yellow-400' },
  { id: 'midnight', bg: 'from-slate-900 via-violet-900 to-fuchsia-900' },
];

const CreateStory = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'choose' | 'photo' | 'text'>('choose');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textOverlay, setTextOverlay] = useState('');
  const [textPosition, setTextPosition] = useState<string>('center');
  const [selectedBg, setSelectedBg] = useState(BG_GRADIENTS[3]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please select an image or video file');
      return;
    }

    if (file.type.startsWith('image/')) {
      try {
        const compressed = await browserImageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        setSelectedFile(compressed);
        setPreviewUrl(URL.createObjectURL(compressed));
      } catch {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    } else {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Video must be under 20MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    setMode('photo');
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (mode === 'text' && !textOverlay.trim()) {
      toast.error('Please enter some text');
      return;
    }
    if (mode === 'photo' && !selectedFile) {
      toast.error('Please select a photo or video');
      return;
    }

    try {
      setLoading(true);
      let mediaUrl = '';
      let mediaType: 'image' | 'video' = 'image';

      if (selectedFile) {
        const ext = selectedFile.name.split('.').pop() || 'jpg';
        mediaType = selectedFile.type.startsWith('video/') ? 'video' : 'image';
        const filePath = `${user.id}/${Date.now()}.${ext}`;
        
        const { error: uploadError } = await supabase.storage
          .from('story-media')
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('story-media')
          .getPublicUrl(filePath);
        mediaUrl = urlData.publicUrl;
      }

      // For text-only stories, use a placeholder
      if (mode === 'text' && !mediaUrl) {
        mediaUrl = 'text-story';
        mediaType = 'image';
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error } = await (supabase as any).from('stories').insert({
        user_id: user.id,
        media_url: mediaUrl,
        media_type: mediaType,
        duration: 10,
        text_overlay: textOverlay || null,
        text_position: textPosition,
        background_color: mode === 'text' ? selectedBg.id : null,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;
      toast.success('Story created!');
      navigate('/discovery');
    } catch (error: any) {
      console.error('Error creating story:', error);
      toast.error(error.message || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  const currentBgGradient = BG_GRADIENTS.find(b => b.id === selectedBg.id) || BG_GRADIENTS[3];
  const currentTextPos = TEXT_POSITIONS.find(p => p.id === textPosition) || TEXT_POSITIONS[1];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <Button variant="ghost" size="icon" onClick={() => mode === 'choose' ? navigate(-1) : setMode('choose')} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">
          {mode === 'choose' ? 'New Story' : mode === 'photo' ? 'Photo Story' : 'Text Story'}
        </h1>
        {mode !== 'choose' && (
          <Button
            size="sm"
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-full bg-primary text-primary-foreground px-5"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Share'}
          </Button>
        )}
        {mode === 'choose' && <div className="w-10" />}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      <AnimatePresence mode="wait">
        {/* Mode Selector */}
        {mode === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 px-8"
          >
            <p className="text-muted-foreground text-center">What kind of story do you want to create?</p>
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all active:scale-95"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Camera className="h-7 w-7 text-primary" />
                </div>
                <span className="font-medium text-xs">Camera</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all active:scale-95"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="h-7 w-7 text-primary" />
                </div>
                <span className="font-medium text-xs">Gallery</span>
              </button>
              <button
                onClick={() => setMode('text')}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all active:scale-95"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Type className="h-7 w-7 text-accent" />
                </div>
                <span className="font-medium text-xs">Text Story</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Photo Story Editor */}
        {mode === 'photo' && previewUrl && (
          <motion.div
            key="photo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Preview */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
              {selectedFile?.type.startsWith('video/') ? (
                <video src={previewUrl} className="max-h-full max-w-full object-contain" autoPlay loop muted />
              ) : (
                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
              )}

              {/* Text overlay preview */}
              {textOverlay && (
                <div className={`absolute ${currentTextPos.className} text-center`}>
                  <p className="text-white text-xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-2 leading-tight">
                    {textOverlay}
                  </p>
                </div>
              )}

              {/* Change photo button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <ImageIcon className="h-3.5 w-3.5" /> Change
              </button>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  placeholder="Add text overlay..."
                  value={textOverlay}
                  onChange={(e) => setTextOverlay(e.target.value)}
                  className="rounded-xl text-sm"
                  maxLength={100}
                />
              </div>
              {textOverlay && (
                <div className="flex gap-2">
                  {TEXT_POSITIONS.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setTextPosition(pos.id)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        textPosition === pos.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Text Story Editor */}
        {mode === 'text' && (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Preview */}
            <div className={`flex-1 relative bg-gradient-to-br ${currentBgGradient.bg} flex items-center justify-center p-8`}>
              <div className={`absolute ${currentTextPos.className} text-center px-6`}>
                <p className="text-white text-2xl font-bold drop-shadow-lg leading-relaxed">
                  {textOverlay || 'Type your story...'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-3 border-t border-border/50">
              <Textarea
                placeholder="What's on your mind?"
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
                className="rounded-xl text-sm resize-none"
                rows={2}
                maxLength={200}
                autoFocus
              />
              
              {/* Background picker */}
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex gap-2 overflow-x-auto">
                  {BG_GRADIENTS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBg(bg)}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${bg.bg} shrink-0 transition-all ${
                        selectedBg.id === bg.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Position picker */}
              <div className="flex gap-2">
                {TEXT_POSITIONS.map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => setTextPosition(pos.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      textPosition === pos.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateStory;
