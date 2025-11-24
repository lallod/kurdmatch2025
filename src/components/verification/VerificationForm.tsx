import { useState, useRef } from 'react';
import { Camera, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type VerificationType = 'selfie' | 'id_document';

export const VerificationForm = () => {
  const [verificationType, setVerificationType] = useState<VerificationType>('selfie');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!previewImage) {
      toast({
        title: 'Error',
        description: 'Please capture or upload an image first',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-verification', {
        body: {
          verificationType,
          imageData: previewImage,
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: 'Success',
        description: 'Verification request submitted successfully. We will review it shortly.',
      });
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit verification request',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <CardTitle>Verification Submitted</CardTitle>
          </div>
          <CardDescription>
            Your verification request has been submitted. We'll review it within 24-48 hours and notify you of the result.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Get verified to increase trust and match quality. Choose one of the verification methods below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Verification Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setVerificationType('selfie')}
            className={`p-4 rounded-lg border-2 transition-all ${
              verificationType === 'selfie'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Camera className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Selfie Verification</p>
            <p className="text-xs text-muted-foreground mt-1">
              Take a photo of yourself
            </p>
          </button>

          <button
            onClick={() => setVerificationType('id_document')}
            className={`p-4 rounded-lg border-2 transition-all ${
              verificationType === 'id_document'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <FileText className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">ID Document</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload government ID
            </p>
          </button>
        </div>

        {/* Image Capture/Upload */}
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors">
            {previewImage ? (
              <div className="space-y-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-64 rounded-lg"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setPreviewImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Retake
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  {verificationType === 'selfie'
                    ? 'Take a clear selfie showing your face'
                    : 'Upload a photo of your government ID'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture={verificationType === 'selfie' ? 'user' : undefined}
                  onChange={handleImageCapture}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {verificationType === 'selfie' ? 'Take Selfie' : 'Upload ID'}
                </Button>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-2">Guidelines:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {verificationType === 'selfie' ? (
                    <>
                      <li>Make sure your face is clearly visible</li>
                      <li>Use good lighting</li>
                      <li>Remove sunglasses or masks</li>
                      <li>Look directly at the camera</li>
                    </>
                  ) : (
                    <>
                      <li>ID must be valid and not expired</li>
                      <li>All text should be clearly readable</li>
                      <li>No glare or shadows on the document</li>
                      <li>Photo should be original (not a photocopy)</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!previewImage || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Verification'}
        </Button>
      </CardContent>
    </Card>
  );
};
