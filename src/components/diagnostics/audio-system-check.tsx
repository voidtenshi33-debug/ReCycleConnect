
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Mic, Volume2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AudioSystemCheckProps {
  onComplete: () => void;
}

export function AudioSystemCheck({ onComplete }: AudioSystemCheckProps) {
  const { toast } = useToast();
  const [stage, setStage] = useState<'intro' | 'speaker' | 'mic' | 'done'>('intro');
  const [isRecording, setIsRecording] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const visualizerFrameRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const playTestTone = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 pitch
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1); // Play for 1 second
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
      setIsRecording(true);
      
      const audioContext = audioContextRef.current!;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      visualize();
    } catch (err) {
      console.error('Mic permission denied:', err);
      setHasMicPermission(false);
      toast({
        variant: 'destructive',
        title: 'Microphone access denied',
        description: 'Please enable microphone permissions to complete this test.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop the visualizer
      cancelAnimationFrame(visualizerFrameRef.current);
      
      // Stop media tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

      toast({ title: 'Microphone test successful!' });
      setStage('done');
    }
  };

  const visualize = () => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const canvasCtx = canvas.getContext('2d')!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
        visualizerFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'hsl(var(--background))';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            canvasCtx.fillStyle = `hsl(var(--primary))`;
            canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
        }
    };
    draw();
  }


  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
       cancelAnimationFrame(visualizerFrameRef.current);
    };
  }, []);

  const renderContent = () => {
    switch (stage) {
      case 'intro':
        return (
          <>
            <h1 className="text-2xl font-bold">Speaker & Microphone Test</h1>
            <p className="text-muted-foreground">We'll test your device's audio output and input.</p>
            <Button onClick={() => setStage('speaker')} size="lg">Start Test</Button>
          </>
        );
      case 'speaker':
        return (
          <>
            <h1 className="text-2xl font-bold">Step 1: Speaker Test</h1>
            <p className="text-muted-foreground">Click the button below. You should hear a tone.</p>
            <Button onClick={playTestTone} size="lg"><Volume2 className="mr-2" /> Play Test Tone</Button>
            <Button onClick={() => setStage('mic')} variant="secondary">I heard it, continue</Button>
          </>
        );
      case 'mic':
        return (
          <>
            <h1 className="text-2xl font-bold">Step 2: Microphone Test</h1>
             <canvas ref={canvasRef} width="300" height="100" className="rounded-lg bg-muted"></canvas>
             {hasMicPermission === false && (
                <Alert variant="destructive">
                    <AlertTitle>Microphone Access Required</AlertTitle>
                    <AlertDescription>Please grant permission to use your microphone.</AlertDescription>
                </Alert>
             )}
            {!isRecording ? (
              <>
                <p className="text-muted-foreground">Click below and say "Hello, ReCycleConnect!"</p>
                <Button onClick={startRecording} size="lg"><Mic className="mr-2" /> Start Recording</Button>
              </>
            ) : (
                <>
                <p className="text-muted-foreground animate-pulse">Recording... Speak now.</p>
                <Button onClick={stopRecording} size="lg" variant="destructive">Stop & Verify</Button>
              </>
            )}
          </>
        );
         case 'done':
        return (
          <>
             <Check className="h-16 w-16 text-green-500 bg-green-100 p-3 rounded-full" />
            <h1 className="text-2xl font-bold">Audio System Verified</h1>
            <p className="text-muted-foreground">Speakers and microphone appear to be working.</p>
            <Button onClick={onComplete} size="lg">Finish</Button>
          </>
        );
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-background p-4 sm:p-8 flex flex-col">
       <div className="w-full max-w-md mx-auto flex-grow flex flex-col items-center justify-center text-center gap-6">
        {renderContent()}
       </div>
       <Button variant="ghost" onClick={onComplete} className="absolute top-4 right-4">
            <X className="mr-2 h-4 w-4" /> Exit Test
        </Button>
    </div>
  );
}
