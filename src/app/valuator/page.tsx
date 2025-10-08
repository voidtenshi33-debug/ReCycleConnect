
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WandSparkles, Wrench, ArrowLeft, Puzzle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeviceValuator } from '@/components/device-valuator';
import { RepairAdvisor } from '@/components/repair-advisor';
import { StandaloneCompatibilityChecker } from '@/components/standalone-compatibility-checker';

export default function AIToolsPage() {
  const router = useRouter();
  
  return (
    <div className="max-w-2xl mx-auto">
       <Link href="/home" className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to home
      </Link>
      <Tabs defaultValue="valuator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="valuator">
                <WandSparkles className="mr-2 h-4 w-4" />
                AI Device Valuator
            </TabsTrigger>
            <TabsTrigger value="repair">
                <Wrench className="mr-2 h-4 w-4" />
                AI Repair Advisor
            </TabsTrigger>
             <TabsTrigger value="compatibility">
                <Puzzle className="mr-2 h-4 w-4" />
                Scrap Part Checker
            </TabsTrigger>
        </TabsList>
        <TabsContent value="valuator">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-3xl flex items-center gap-2">
                    <WandSparkles className="text-primary" /> AI Device Valuator
                </CardTitle>
                <CardDescription>
                    Upload photos of your device and our AI will estimate its resale value.
                    For best results, upload clear photos of the screen, back, and any visible damage.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <DeviceValuator />
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="repair">
            <Card>
                 <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-2">
                        <Wrench className="text-primary" /> AI Repair Advisor
                    </CardTitle>
                    <CardDescription>
                        Describe your device's problem and our AI will provide a diagnosis, estimated repair cost, and connect you with local experts.
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <RepairAdvisor />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="compatibility">
            <Card>
                 <CardHeader>
                    <CardTitle className="font-headline text-3xl flex items-center gap-2">
                        <Puzzle className="text-primary" /> AI Scrap Part Compatibility Checker
                    </CardTitle>
                    <CardDescription>
                        Not sure if a scrap part will work with your device? Or which devices it fits? Just show it to our AI!
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <StandaloneCompatibilityChecker />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
