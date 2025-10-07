
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Puzzle, Sparkles, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import type { Item } from '@/lib/types';
import { handlePartCompatibilityCheck } from '@/app/actions';
import type { PartCompatibilityOutput } from '@/ai/flows/compatibility-checker-flow';
import { cn } from '@/lib/utils';


function CompatibilityResult({ result, onReset }: { result: PartCompatibilityOutput; onReset: () => void }) {

    const getResultVariant = () => {
        if (result.verdict.startsWith('✅')) return 'success';
        if (result.verdict.startsWith('⚠️')) return 'warning';
        return 'destructive';
    }

    const getResultIcon = () => {
        if (result.verdict.startsWith('✅')) return <CheckCircle className="h-4 w-4" />;
        if (result.verdict.startsWith('⚠️')) return <AlertTriangle className="h-4 w-4" />;
        return <XCircle className="h-4 w-4" />;
    }

    const variant = getResultVariant();

  return (
    <div className="space-y-4">
      <Alert variant={variant === 'success' ? 'default' : variant} className={cn(variant === 'success' && 'border-green-500 text-green-700 [&>svg]:text-green-700', variant === 'warning' && 'border-amber-500 text-amber-700 [&>svg]:text-amber-700')}>
        {getResultIcon()}
        <AlertTitle className="font-bold">{result.verdict}</AlertTitle>
        <AlertDescription>
          {result.reasoning}
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
            Check if "<b>{item.title}</b>" is compatible with your device.
          </DialogDescription>
        </DialogHeader>
        
        {result ? (
            <CompatibilityResult result={result} onReset={resetForm} />
        ) : (
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="user-device-model">Your Device Model Name</Label>
                    <Input
                        id="user-device-model"
                        value={userDeviceModel}
                        onChange={(e) => setUserDeviceModel(e.target.value)}
                        placeholder="e.g., Dell XPS 13 9380"
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
