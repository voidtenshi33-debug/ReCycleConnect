
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight, Circle, ScreenShare, Fingerprint, Mic, Video } from "lucide-react";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScreenHealthCheck } from '@/components/diagnostics/screen-health-check';
import { TouchscreenTest } from '@/components/diagnostics/touchscreen-test';
import { AudioSystemCheck } from '@/components/diagnostics/audio-system-check';
import { VideoVerification } from '@/components/diagnostics/video-verification';


type TestId = 'screen' | 'touch' | 'audio' | 'video';

type Test = {
    id: TestId;
    title: string;
    description: string;
    icon: React.ElementType;
    component: React.ElementType;
}

const diagnosticTests: Test[] = [
    {
        id: 'screen',
        title: 'Screen Health Check',
        description: 'Check for dead pixels, discoloration, and burn-in.',
        icon: ScreenShare,
        component: ScreenHealthCheck,
    },
    {
        id: 'touch',
        title: 'Touchscreen & Digitizer Test',
        description: 'Verify all areas of the touchscreen are responsive.',
        icon: Fingerprint,
        component: TouchscreenTest,
    },
    {
        id: 'audio',
        title: 'Speaker & Microphone Check',
        description: 'Test speaker output and microphone input.',
        icon: Mic,
        component: AudioSystemCheck,
    },
     {
        id: 'video',
        title: 'Video Verification',
        description: 'Record a "proof of life" video to show the device works.',
        icon: Video,
        component: VideoVerification,
    }
];

export default function SmartDiagnosticsPage() {
    const [activeTest, setActiveTest] = useState<TestId | null>(null);
    const [completedTests, setCompletedTests] = useState<Record<TestId, boolean>>({
        screen: false,
        touch: false,
        audio: false,
        video: false,
    });

    const handleTestComplete = (testId: TestId) => {
        setCompletedTests(prev => ({ ...prev, [testId]: true }));
        setActiveTest(null);
    };

    const ActiveTestComponent = activeTest ? diagnosticTests.find(t => t.id === activeTest)?.component : null;

    if (activeTest && ActiveTestComponent) {
        return <ActiveTestComponent onComplete={() => handleTestComplete(activeTest)} />;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">AI-Assisted Interactive Diagnostic</CardTitle>
                    <CardDescription>
                        Complete these quick, guided tests to verify your device's condition. A verified report builds buyer trust and can help you sell faster at a better price.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {diagnosticTests.map(test => (
                        <button
                            key={test.id}
                            onClick={() => setActiveTest(test.id)}
                            className="w-full text-left"
                        >
                            <Card className="hover:border-primary transition-all">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={cn(
                                        "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0",
                                        completedTests[test.id] ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                                    )}>
                                        {completedTests[test.id] ? <Check className="h-6 w-6" /> : <test.icon className="h-6 w-6" />}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{test.title}</h3>
                                        <p className="text-sm text-muted-foreground">{test.description}</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </CardContent>
                            </Card>
                        </button>
                    ))}
                </CardContent>
            </Card>
            
            <div className="text-center">
                 <Button disabled={Object.values(completedTests).every(t => !t)}>Generate Report</Button>
            </div>
        </div>
    );
}
