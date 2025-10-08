
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, CheckCircle, XCircle, AlertTriangle, List } from 'lucide-react';
import { handlePartCompatibilityCheck, handleGeneratePartDescription } from '@/app/actions';
import type { PartCompatibilityOutput } from '@/ai/flows/compatibility-checker-flow';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { ItemCard } from './item-card';
import { items as mockItems } from '@/lib/data';
import Link from 'next/link';
import { MultiImageUpload } from './multi-image-upload';
import { useToast } from '@/hooks/use-toast';


function isDirectCheck(result: PartCompatibilityOutput): result is { compatibilityLevel: string; explanation: string } {
    return 'compatibilityLevel' in result;
}

function isBroadSearch(result: PartCompatibilityOutput): result is { compatibleDevices: any[]; partIdentification: string } {
    return 'compatibleDevices' in result;
}


function CompatibilityResult({ partInfo, userDevice, result, onReset }: { partInfo: string; userDevice: string; result: PartCompatibilityOutput; onReset: () => void }) {

    if (isDirectCheck(result)) {
        const getResultVariant = () => {
            if (result.compatibilityLevel === 'High') return 'success';
            if (result.compatibilityLevel === 'Partial') return 'warning';
            return 'destructive';
        }

        const getResultIcon = () => {
            if (result.compatibilityLevel === 'High') return <CheckCircle className="h-8 w-8" />;
            if (result.compatibilityLevel === 'Partial') return <AlertTriangle className="h-8 w-8" />;
            return <XCircle className="h-8 w-8" />;
        }
        
        const getVerdictText = () => {
            if (result.compatibilityLevel === 'High') return '✅ High Compatibility';
            if (result.compatibilityLevel === 'Partial') return '⚠️ Partial Compatibility';
            return '❌ Incompatible';
        }

        const variant = getResultVariant();
        const isCompatible = result.compatibilityLevel !== 'Incompatible';

        // Smart Upsell Logic for Direct Check
        const smartUpsellItems = mockItems.filter(item => {
            const targetSearchTerm = isCompatible
                ? partInfo.split(' ')[0].toLowerCase() 
                : userDevice.split(' ')[1]?.toLowerCase() || userDevice.toLowerCase();

            return item.title.toLowerCase().includes(targetSearchTerm) && item.category === 'Components';
        }).slice(0, 3);
        
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className={cn(
                            'flex flex-col items-center text-center p-4 rounded-lg',
                            variant === 'success' && 'bg-green-50 text-green-900', 
                            variant === 'warning' && 'bg-amber-50 text-amber-900',
                            variant === 'destructive' && 'bg-destructive/10 text-destructive'
                            )}>
                            {getResultIcon()}
                            <h3 className="text-xl font-bold mt-2">{getVerdictText()}</h3>
                        </div>

                        <div className="text-sm p-4 bg-muted/50 rounded-lg space-y-2">
                            <div className="flex justify-between items-start">
                                <span className="text-muted-foreground pt-1">Scrap Part:</span>
                                <span className="font-semibold text-right max-w-[70%]">{partInfo || 'Part from image'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Your Device:</span>
                                <span className="font-semibold text-right">{userDevice}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold">AI Analysis:</h4>
                            <p className="text-muted-foreground">{result.explanation}</p>
                        </div>
                    </CardContent>
                </Card>
                
                {smartUpsellItems.length > 0 && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-semibold text-center">
                            {isCompatible ? "Great! Before you buy elsewhere, find a deal on ReCycleConnect!" : `But we found these compatible parts for your ${userDevice}!`}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {smartUpsellItems.map(item => <ItemCard key={item.id} item={item} />)}
                        </div>
                    </div>
                )}

                <Button variant="outline" className="w-full" onClick={onReset}>Check Another Part</Button>
            </div>
        );
    }

    if (isBroadSearch(result)) {
         return (
            <div className="space-y-6">
                 <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="bg-blue-50 text-blue-900 flex flex-col items-center text-center p-4 rounded-lg">
                           <List className="h-8 w-8" />
                           <h3 className="text-xl font-bold mt-2">Compatible Devices Found</h3>
                        </div>
                         <div className="text-sm p-4 bg-muted/50 rounded-lg space-y-2">
                             <p><span className="font-semibold">AI Part Identification:</span> This looks like {result.partIdentification}.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">This part may be compatible with the following:</h4>
                            <div className="space-y-3">
                            {result.compatibleDevices.map(deviceInfo => (
                                <div key={deviceInfo.brand} className="p-3 border rounded-md">
                                    <p className="font-semibold">{deviceInfo.brand}</p>
                                    <ul className="list-disc list-inside text-muted-foreground text-sm">
                                        {deviceInfo.exampleModels.map(model => <li key={model}>{model}</li>)}
                                    </ul>
                                </div>
                            ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Button variant="outline" className="w-full" onClick={onReset}>Check Another Part</Button>
            </div>
        )
    }

    return null; // Should not happen
}


export function StandaloneCompatibilityChecker() {
  const { toast } = useToast();
  const [partTitle, setPartTitle] = useState('');
  const [partDescription, setPartDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [userDeviceModel, setUserDeviceModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PartCompatibilityOutput | null>(null);

  const handleGenerateDescriptionClick = async () => {
    if (images.length === 0) {
        toast({
            title: "Upload an Image First",
            description: "Please upload at least one image to identify the part.",
            variant: "destructive"
        });
        return;
    }

    setIsGeneratingDesc(true);
    const result = await handleGeneratePartDescription(images);
    if (result.description) {
        setPartDescription(result.description);
        toast({
            title: "Description Generated!",
            description: "The AI has described the part from your image.",
        });
    } else if (result.error) {
        toast({
            title: "Error",
            description: result.error,
            variant: "destructive"
        });
    }
    setIsGeneratingDesc(false);
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!partTitle && images.length === 0) {
      setError("Please provide a part name or at least one image.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    const compatibilityResult = await handlePartCompatibilityCheck(partTitle, partDescription, images, userDeviceModel);

    if (compatibilityResult.error) {
      setError(compatibilityResult.error);
    } else if (compatibilityResult.compatibility) {
      setResult(compatibilityResult.compatibility);
    }
    
    setIsLoading(false);
  };
  
  const resetForm = () => {
      setPartTitle('');
      setPartDescription('');
      setImages([]);
      setUserDeviceModel('');
      setResult(null);
      setError(null);
      setIsLoading(false);
  }

  const getButtonText = () => {
      if (isLoading) return 'Analyzing... 🧠';
      if (userDeviceModel) return 'Check Compatibility';
      return 'Analyze Scrap Part';
  }

  return (
    <div>
        {result ? (
            <CompatibilityResult partInfo={partTitle} userDevice={userDeviceModel} result={result} onReset={resetForm} />
        ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="part-title">Scrap Part Title (Optional)</Label>
                    <Input
                        id="part-title"
                        value={partTitle}
                        onChange={(e) => setPartTitle(e.target.value)}
                        placeholder="e.g., Green circuit board from an old laptop"
                    />
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="part-description">Scrap Part Description (Optional)</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescriptionClick} disabled={isGeneratingDesc || images.length === 0}>
                        {isGeneratingDesc ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        AI Generate
                      </Button>
                    </div>
                    <Textarea
                        id="part-description"
                        value={partDescription}
                        onChange={(e) => setPartDescription(e.target.value)}
                        placeholder="Include any model numbers or extra details you know."
                        rows={2}
                    />
                </div>

                 <div className="space-y-2">
                    <Label>Scrap Part Images (up to 3)</Label>
                    <MultiImageUpload images={images} setImages={setImages} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="user-device-model">Your Device Model (Optional)</Label>
                    <Input
                        id="user-device-model"
                        value={userDeviceModel}
                        onChange={(e) => setUserDeviceModel(e.target.value)}
                        placeholder="e.g., Samsung Galaxy A51"
                    />
                     <p className="text-xs text-muted-foreground">You can usually find this on the back of your device or in settings.</p>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                
                <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {getButtonText()}
                </Button>
            </form>
        )}
      </div>
  );
}
