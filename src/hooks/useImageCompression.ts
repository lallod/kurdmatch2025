import imageCompression from 'browser-image-compression';

interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

export const useImageCompression = () => {
  const compressImage = async (
    file: File,
    options?: CompressionOptions
  ): Promise<File> => {
    const defaultOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg' as const,
      ...options
    };

    try {
      // Only compress if file is larger than 500KB
      if (file.size < 500 * 1024) {
        console.log('Image is small enough, skipping compression');
        return file;
      }

      console.log(`Compressing image from ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      const compressedFile = await imageCompression(file, defaultOptions);
      console.log(`Compressed to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      // Return original file if compression fails
      return file;
    }
  };

  const compressImageForChat = async (file: File): Promise<File> => {
    return compressImage(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1280
    });
  };

  const compressImageForProfile = async (file: File): Promise<File> => {
    return compressImage(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920
    });
  };

  const compressImageForStory = async (file: File): Promise<File> => {
    return compressImage(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1080
    });
  };

  return { 
    compressImage, 
    compressImageForChat, 
    compressImageForProfile,
    compressImageForStory 
  };
};
