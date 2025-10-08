
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Puzzle, Sparkles, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { Item } from '@/lib/types';
import { handlePartCompatibilityCheck } from '@/app/actions';
import type { PartCompatibilityOutput } from '@/ai/flows/compatibility-checker-flow';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';


function CompatibilityResult({ item, userDevice, result, onReset }: { item: Item; userDevice: string; result: PartCompatibilityOutput; onReset: () => void }) {

    const getResultVariant = () => {
        if (result.compatibilityLevel === 'High') return 'success';
        if (result.compatibilityLevel === 'Partial') return 'warning';
        return 'destructive';
    }

    const getResultIcon = () => {
        if (result.compatibilityLevel === 'High') return <CheckCircle className="h-5 w-5" />;
        if (result.compatibilityLevel === 'Partial') return <AlertTriangle className="h-5 w-5" />;
        return <XCircle className="h-5 w-5" />;
    }
    
    const getVerdictText = () => {
        if (result.compatibilityLevel === 'High') return '✅ High Compatibility';
        if (result.compatibilityLevel === 'Partial') return '⚠️ Partial Compatibility';
        return '❌ Incompatible';
    }

    const variant = getResultVariant();

  return (
    <div className="space-y-4">
       <div className="text-sm p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Part:</span>
                <span className="font-semibold text-right">{item.title}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Your Device:</span>
                <span className="font-semibold text-right">{userDevice}</span>
            </div>
        </div>
      <Alert variant={variant === 'success' ? 'default' : variant} className={cn(
          'flex flex-col items-center text-center p-6',
          variant === 'success' && 'border-green-500 bg-green-50 text-green-900', 
          variant === 'warning' && 'border-amber-500 bg-amber-50 text-amber-900',
          variant === 'destructive' && 'bg-destructive/10'
        )}>
        {getResultIcon()}
        <AlertTitle className="text-lg font-bold mt-2">{getVerdictText()}</AlertTitle>
        <AlertDescription className="mt-2 text-base">
          {result.explanation}
        </AlertDescription>
      </Alert>
      <Button variant="outline" className="w-full" onClick={onReset}>
        Check Another Device
      </Button>
    </div>
  );
}


export function CompatibilityChecker({ item }: { item: Item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userDeviceModel, setUserDeviceModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PartCompatibilityOutput | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userDeviceModel) {
      setError("Please enter your device model name.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    const compatibilityResult = await handlePartCompatibilityCheck(item.title, item.description, userDeviceModel);

    if (compatibilityResult.error) {
      setError(compatibilityResult.error);
    } else if (compatibilityResult.compatibility) {
      setResult(compatibilityResult.compatibility);
    }
    
    setIsLoading(false);
  };
  
  const resetForm = () => {
      setUserDeviceModel('');
      setResult(null);
      setError(null);
      setIsLoading(false);
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        // Reset state when dialog closes
        setTimeout(resetForm, 300);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <Puzzle className="mr-2 h-5 w-5" />
          Check Compatibility
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Compatibility Checker</DialogTitle>
          <DialogDescription>
            Check if this "<b>{item.title}</b>" is compatible with your device.
          </DialogDescription>
        </DialogHeader>
        
        {result ? (
            <CompatibilityResult item={item} userDevice={userDeviceModel} result={result} onReset={resetForm} />
        ) : (
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="user-device-model">What device do you want to install this part in?</Label>
                    <Input
                        id="user-device-model"
                        value={userDeviceModel}
                        onChange={(e) => setUserDeviceModel(e.target.value)}
                        placeholder="e.g., Samsung Galaxy A51"
                        required
                    />
                     <p className="text-xs text-muted-foreground">You can usually find this on the back or bottom of your device.</p>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <DialogFooter>
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? 'Checking...' : 'Check Now'}
                    </Button>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
