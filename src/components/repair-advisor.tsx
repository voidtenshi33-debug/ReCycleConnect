
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { handleRepairAdvice } from '@/app/actions';
import type { RepairAdviceOutput } from '@/ai/flows/repair-advisor-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Wrench, MessageSquare, Star } from 'lucide-react';
import type { RepairShop } from '@/lib/types';
import { MultiImageUpload } from './multi-image-upload';


const mockRepairShops: RepairShop[] = [
    { id: 'shop1', name: 'Pune Mobile Experts', locality: 'Kothrud', rating: 4.8, services: ['Screen Repair', 'Battery'] },
    { id: 'shop2', name: 'QuickFix Electronics', locality: 'Viman Nagar', rating: 4.6, services: ['Screen Repair', 'Water Damage'] },
    { id: 'shop3', name: 'Gadget Gurus', locality: 'Koregaon Park', rating: 4.9, services: ['All Brands', 'Software'] },
];

function RepairShopCard({ shop }: { shop: RepairShop }) {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-grow">
                    <h4 className="font-semibold">{shop.name}</h4>
                    <p className="text-sm text-muted-foreground">{shop.locality}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{shop.rating}</span>
                    </div>
                </div>
                <Button size="sm" className="w-full sm:w-auto">
                    <MessageSquare className="mr-2 h-4 w-4" /> Request a Quote
                </Button>
            </CardContent>
        </Card>
    )
}

function RepairResult({ result }: { result: RepairAdviceOutput }) {
  return (
    <div className="space-y-6">
      <Alert className="border-primary">
        <Wrench className="h-4 w-4" />
        <AlertTitle className="font-bold">AI Diagnosis Complete</AlertTitle>
        <AlertDescription className="space-y-3 mt-2">
          <div>
            <p className="font-semibold">Probable Issue</p>
            <p>{result.probableIssue}</p>
          </div>
          <div>
            <p className="font-semibold">Estimated Cost</p>
            <p className="text-lg font-bold">{result.estimatedCostRange}</p>
          </div>
           <div>
            <p className="font-semibold">Repairability</p>
            <p>{result.repairability}</p>
          </div>
          <div>
            <p className="font-semibold">Our Advice</p>
            <p>{result.suggestedAction}</p>
          </div>
        </AlertDescription>
      </Alert>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Connect with Local Repair Shops</h3>
        <div className="space-y-4">
            {mockRepairShops.map(shop => <RepairShopCard key={shop.id} shop={shop} />)}
        </div>
      </div>
    </div>
  );
}

export function RepairAdvisor() {
  const [deviceName, setDeviceName] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RepairAdviceOutput | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!deviceName || !problemDescription) {
      setError("Please fill out all fields.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    const adviceResult = await handleRepairAdvice(deviceName, problemDescription, images);

    if (adviceResult.error) {
      setError(adviceResult.error);
    } else if (adviceResult.advice) {
      setResult(adviceResult.advice);
    }
    
    setIsLoading(false);
  };
  
  const resetForm = () => {
      setDeviceName('');
      setProblemDescription('');
      setImages([]);
      setResult(null);
      setError(null);
      setIsLoading(false);
  }

  return (
    <div>
        {result ? (
            <div className="space-y-4">
                <RepairResult result={result} />
                 <Button variant="outline" onClick={resetForm} className="w-full">
                    Start New Diagnosis
                </Button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="device-name">Device Name</Label>
                    <Input
                    id="device-name"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="e.g., Apple iPhone 11 Pro"
                    required
                    />
                </div>

                 <div className="space-y-2">
                    <Label>Images of Damage (Optional)</Label>
                    <MultiImageUpload images={images} setImages={setImages} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="problem-description">Problem Description</Label>
                    <Textarea
                    id="problem-description"
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe the issue in detail. e.g., The screen is cracked and won't turn on. There are lines across the display."
                    required
                    rows={5}
                    />
                </div>
                
                {error && <p className="text-sm text-destructive">{error}</p>}
                
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Diagnosing...' : 'Get Repair Advice'}
                </Button>
            </form>
        )}
    </div>
  );
}
