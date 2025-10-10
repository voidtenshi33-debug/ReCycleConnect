
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, RefreshCcw, Video, Check, X, Loader2 } from 'lucide-react';
import { Progress } from '../ui/progress';

interface VideoVerificationProps {
  onComplete: () => void;
}

const RECORDING_DURATION = 10; // seconds

export function VideoVerification({ onComplete }: VideoVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const getCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
      setHasCameraPermission(true);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera & Mic Access Denied',
        description: 'Please enable permissions in your browser settings to use this feature.',
      });
    }
  };
  
  useEffect(() => {
    getCameraPermission();

    return () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
        }
    }
  }, []);

  const startRecording = () => {
    if (!streamRef.current) return;
    setIsRecording(true);
    setRecordedVideoUrl(null);
    setRecordingProgress(0);

    const recordedChunks: Blob[] = [];
    mediaRecorderRef.current = new MediaRecorder(streamRef.current);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setIsRecording(false);
       if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
        }
    };

    mediaRecorderRef.current.start();
    
    const startTime = Date.now();
    recordingIntervalRef.current = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const progress = (elapsedTime / RECORDING_DURATION) * 100;
        setRecordingProgress(progress);
        if (elapsedTime >= RECORDING_DURATION) {
            stopRecording();
        }
    }, 100);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const reset = () => {
    setRecordedVideoUrl(null);
    setRecordingProgress(0);
    if (!streamRef.current) {
        getCameraPermission();
    }
  }


  return (
     <div className="fixed inset-0 z-50 bg-background p-4 sm:p-8 flex flex-col">
       <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col items-center justify-center text-center gap-6">
        <h1 className="text-2xl font-bold">Step 4: Video Verification</h1>
         <p className="text-muted-foreground">Record a short, continuous video showing the device turning on and being used. This builds buyer trust.</p>
        
        <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
            <video ref={videoRef} className={cn("w-full h-full object-cover", recordedVideoUrl && "hidden")} autoPlay playsInline muted />
            {recordedVideoUrl && (
                <video src={recordedVideoUrl} className="w-full h-full object-cover" controls autoPlay />
            )}
             {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive/80 text-destructive-foreground p-2 rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>REC</span>
                </div>
            )}
        </div>
        
        {hasCameraPermission === false && (
            <Alert variant="destructive">
            <Camera className="h-4 w-4" />
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
                Please allow camera access to use this feature.
            </AlertDescription>
            </Alert>
        )}

        {isRecording && <Progress value={recordingProgress} />}

        {!recordedVideoUrl ? (
            <Button onClick={isRecording ? stopRecording : startRecording} disabled={!hasCameraPermission} size="lg" className="w-full">
                <Video className="mr-2 h-5 w-5" />
                {isRecording ? `Recording... (${Math.round(recordingProgress)}%)` : `Start ${RECORDING_DURATION}s Recording`}
            </Button>
        ) : (
            <div className="grid grid-cols-2 gap-4 w-full">
                <Button onClick={reset} variant="outline" size="lg">
                    <RefreshCcw className="mr-2 h-5 w-5" />
                    Record Again
                </Button>
                <Button onClick={onComplete} size="lg">
                    <Check className="mr-2 h-5 w-5" />
                    Save & Finish
                </Button>
            </div>
        )}

       </div>
        <Button variant="ghost" onClick={onComplete} className="absolute top-4 right-4">
            <X className="mr-2 h-4 w-4" /> Exit
        </Button>
    </div>
  );
}
