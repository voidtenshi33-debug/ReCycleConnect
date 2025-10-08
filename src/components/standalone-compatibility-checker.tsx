
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { handlePartCompatibilityCheck } from '@/app/actions';
import type { PartCompatibilityOutput } from '@/ai/flows/compatibility-checker-flow';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { ItemCard } from './item-card';
import { items as mockItems } from '@/lib/data';
import Link from 'next/link';


function CompatibilityResult({ partInfo, userDevice, result, onReset }: { partInfo: string; userDevice: string; result: PartCompatibilityOutput; onReset: () => void }) {

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

    // This is a simplified search for the "Smart Upsell" feature.
    // In a real app, you'd use a more robust search algorithm.
    const smartUpsellItems = mockItems.filter(item => {
        const targetSearchTerm = isCompatible
            ? partInfo.split(' ')[0].toLowerCase() // e.g., 'screen'
            : userDevice.split(' ')[1].toLowerCase(); // e.g., 'a51'

        return item.title.toLowerCase().includes(targetSearchTerm);
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
                        <span className="text-muted-foreground pt-1">Part:</span>
                        <span className="font-semibold text-right max-w-[70%]">{partInfo}</span>
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


      <Button variant="outline" className="w-full" onClick={onReset}>
        Check Another Part
      </Button>
    </div>
  );
}


export function StandaloneCompatibilityChecker() {
  const [partTitle, setPartTitle] = useState('');
  const [partDescription, setPartDescription] = useState('');
  const [userDeviceModel, setUserDeviceModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PartCompatibilityOutput | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!partTitle || !userDeviceModel) {
      setError("Please fill out all required fields.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    const compatibilityResult = await handlePartCompatibilityCheck(partTitle, partDescription, userDeviceModel);

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
      setUserDeviceModel('');
      setResult(null);
      setError(null);
      setIsLoading(false);
  }

  return (
    <div>
        {result ? (
            <CompatibilityResult partInfo={partTitle} userDevice={userDeviceModel} result={result} onReset={resetForm} />
        ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="part-title">Spare Part Title</Label>
                    <Input
                        id="part-title"
                        value={partTitle}
                        onChange={(e) => setPartTitle(e.target.value)}
                        placeholder="e.g., Screen Assembly for Samsung M31"
                        required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="part-description">Spare Part Description (Optional)</Label>
                    <Textarea
                        id="part-description"
                        value={partDescription}
                        onChange={(e) => setPartDescription(e.target.value)}
                        placeholder="Include any model numbers or extra details."
                        rows={3}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="user-device-model">Your Device Model</Label>
                    <Input
                        id="user-device-model"
                        value={userDeviceModel}
                        onChange={(e) => setUserDeviceModel(e.target.value)}
                        placeholder="e.g., Samsung Galaxy A51"
                        required
                    />
                     <p className="text-xs text-muted-foreground">You can usually find this on the back of your device or in settings.</p>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                
                <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Analyzing Compatibility... 🧠' : 'Check Compatibility'}
                </Button>
            </form>
        )}
      </div>
  );
}

