
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CameraCapture } from '@/components/camera-capture';
import { Upload, Camera, X, ImagePlus } from "lucide-react";


interface MultiImageUploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export function MultiImageUpload({ images, setImages }: MultiImageUploadProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filesToProcess = Array.from(files).slice(0, 3 - images.length);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const handleCapture = (imageDataUri: string) => {
    if (images.length < 3) {
      setImages(prev => [...prev, imageDataUri]);
    }
    setIsCameraOpen(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <div className="grid grid-cols-3 gap-4">
        {images.map((src, index) => (
        <div key={index} className="relative aspect-square rounded-lg border">
            <Image src={src} alt={`Preview ${index}`} fill className="object-cover rounded-lg" />
            <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={() => removeImage(index)}
            >
            <X className="h-4 w-4" />
            </Button>
        </div>
        ))}

        {images.length < 3 && (
            <div className="grid grid-cols-2 gap-2 aspect-square">
                <label htmlFor="image-upload" className="cursor-pointer rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors p-2 text-center">
                    <ImagePlus className="h-8 w-8" />
                    <span className="text-xs mt-1">Add Image</span>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={handleFileChange}
                        disabled={images.length >= 3}
                    />
                </label>
                <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                    <DialogTrigger asChild>
                    <button type="button" className="cursor-pointer rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors p-2 text-center" disabled={images.length >= 3}>
                        <Camera className="h-8 w-8" />
                        <span className="text-xs mt-1">Use Camera</span>
                    </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Capture Photo</DialogTitle>
                        </DialogHeader>
                        <CameraCapture onCapture={handleCapture} />
                    </DialogContent>
                </Dialog>
            </div>
        )}
    </div>
  );
}
