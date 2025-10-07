
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleDeviceValuation } from '@/app/actions';
import type { DeviceValuationOutput } from '@/ai/flows/device-valuator-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ImagePlus, Loader2, Sparkles, WandSparkles, X, List, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categories as appCategories } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CameraCapture } from '@/components/camera-capture';


function ValuationResult({ result }: { result: DeviceValuationOutput }) {
  const router = useRouter();

  const handleListNow = () => {
    const categorySlug = appCategories.find(c => c.name.toLowerCase() === result.suggestedCategory.toLowerCase())?.slug || 'other';

    const queryParams = new URLSearchParams({
      title: result.suggestedTitle,
      category: categorySlug,
      minPrice: result.estimatedLowPrice.toString(),
      maxPrice: result.estimatedHighPrice.toString(),
    });
    router.push(`/post-item?${queryParams.toString()}`);
  }

  const midPrice = Math.round((result.estimatedLowPrice + result.estimatedHighPrice) / 200) * 100;

  return (
    <div className="space-y-4">
      <Alert className="border-primary text-center">
        <WandSparkles className="h-4 w-4" />
        <AlertTitle className="font-bold">Valuation Complete!</AlertTitle>
        <AlertDescription className="space-y-2">
          <p className="font-semibold text-2xl">
            ₹{result.estimatedLowPrice.toLocaleString('en-IN')} - ₹{result.estimatedHighPrice.toLocaleString('en-IN')}
          </p>
          <p><span className="font-semibold">Suggested Title:</span> {result.suggestedTitle}</p>
          <p><span className="font-semibold">Condition:</span> {result.conditionAssessment}</p>
          <p><span className="font-semibold">Reasoning:</span> {result.reasoning}</p>
        </AlertDescription>
      </Alert>
       <Button size="lg" className="w-full" onClick={handleListNow}>
        <List className="mr-2 h-4 w-4" />
        List this {result.suggestedCategory} for ~₹{midPrice.toLocaleString('en-IN')}
      </Button>
    </div>
  );
}

export function DeviceValuator() {
  const [deviceName, setDeviceName] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DeviceValuationOutput | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Allow up to 3 images
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (images.length === 0 || !deviceName) {
      setError("Please provide a device name and at least one image.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    const valuationResult = await handleDeviceValuation(deviceName, images);

    if (valuationResult.error) {
      setError(valuationResult.error);
    } else if (valuationResult.valuation) {
      setResult(valuationResult.valuation);
    }
    
    setIsLoading(false);
  };
  
  const resetForm = () => {
      setDeviceName('');
      setImages([]);
      setResult(null);
      setError(null);
      setIsLoading(false);
  }

  return (
    <div>
        {result ? (
            <div className="space-y-4">
                <ValuationResult result={result} />
                <Button variant="outline" onClick={resetForm} className="w-full">
                    Start New Valuation
                </Button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="device-name-valuator">Device Name</Label>
                    <Input
                    id="device-name-valuator"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="e.g., Apple iPhone 14 Pro"
                    required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Device Images (up to 3)</Label>
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
                            <label htmlFor="image-upload" className="cursor-pointer rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors p-2">
                                <ImagePlus className="h-8 w-8" />
                                <span className="text-xs mt-1 text-center">Add Image</span>
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
                                <button type="button" className="cursor-pointer rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors p-2" disabled={images.length >= 3}>
                                <Camera className="h-8 w-8" />
                                <span className="text-xs mt-1 text-center">Use Camera</span>
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
                </div>
                
                {error && <p className="text-sm text-destructive">{error}</p>}
                
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Analyzing...' : 'Estimate Value'}
                </Button>
            </form>
        )}
    </div>
  );
}
