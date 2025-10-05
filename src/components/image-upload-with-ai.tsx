"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, Loader2 } from "lucide-react";
import { handleSuggestCategory } from "@/app/actions";

interface ImageUploadWithAIProps {
  onCategoriesSuggested: (categories: string[]) => void;
  onImageSelected: (dataUri: string) => void;
}

export function ImageUploadWithAI({ onCategoriesSuggested, onImageSelected }: ImageUploadWithAIProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        onImageSelected(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSuggest = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('photoDataUri', imagePreview);
    const result = await handleSuggestCategory(formData);
    setIsLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.suggestions) {
      onCategoriesSuggested(result.suggestions);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="relative mb-4 group aspect-video border-dashed border-2 rounded-lg flex items-center justify-center">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Item preview"
              fill
              className="object-contain rounded-lg"
            />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center">
              <Upload className="h-10 w-10 mb-2" />
              <span>Upload an image</span>
            </div>
          )}
          <label
            htmlFor="image-upload"
            className="absolute inset-0 cursor-pointer"
          />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
        <Button
          type="button"
          onClick={onSuggest}
          disabled={!imagePreview || isLoading}
          className="w-full max-w-sm"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Suggest Category with AI
        </Button>
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}
