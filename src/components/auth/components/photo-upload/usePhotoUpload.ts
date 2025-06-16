
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface UsePhotoUploadProps {
  form: UseFormReturn<any>;
  photoFieldId: string;
}

export const usePhotoUpload = ({ form, photoFieldId }: UsePhotoUploadProps) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState<string | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<string[]>([]);

  useEffect(() => {
    const formPhotos = form.getValues(photoFieldId) || [];
    console.log('PhotoUploadStep: Initial photos from form:', formPhotos);
    
    if (Array.isArray(formPhotos) && formPhotos.length > 0) {
      setPhotos(formPhotos);
    }
  }, [form, photoFieldId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (photos.length >= 5) {
      return;
    }

    const filesToProcess = Array.from(files).slice(0, 5 - photos.length);
    const dataUrls: string[] = [];
    let processedCount = 0;

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          dataUrls.push(e.target.result as string);
        }
        processedCount++;
        if (processedCount === filesToProcess.length) {
          if (dataUrls.length > 0) {
            setPhotoToEdit(dataUrls[0]);
            setPendingPhotos(dataUrls.slice(1));
            setIsStudioOpen(true);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSavePhoto = (editedPhotoUrl: string) => {
    const newPhotos = [...photos, editedPhotoUrl];
    setPhotos(newPhotos);
    
    form.setValue(photoFieldId, newPhotos, { shouldValidate: true });
    form.clearErrors(photoFieldId);
    
    console.log('PhotoUploadStep: Saved photo, new photos array:', newPhotos);

    if (pendingPhotos.length > 0) {
      setPhotoToEdit(pendingPhotos[0]);
      setPendingPhotos(pendingPhotos.slice(1));
      setIsStudioOpen(true);
    } else {
      setPhotoToEdit(null);
      setIsStudioOpen(false);
    }
  };

  const handleCloseStudio = () => {
    setPhotoToEdit(null);
    setPendingPhotos([]);
    setIsStudioOpen(false);
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    
    form.setValue(photoFieldId, newPhotos, { shouldValidate: true });
    
    console.log('PhotoUploadStep: Removed photo, new photos array:', newPhotos);
  };

  return {
    photos,
    dragActive,
    photoToEdit,
    isStudioOpen,
    pendingPhotos,
    handleDrag,
    handleDrop,
    handleFileChange,
    handleSavePhoto,
    handleCloseStudio,
    removePhoto,
    setIsStudioOpen
  };
};
