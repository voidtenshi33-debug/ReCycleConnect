
'use client';

import { Mic } from 'lucide-react';
import { T } from './t';

interface ListeningOverlayProps {
  isOpen: boolean;
}

export function ListeningOverlay({ isOpen }: ListeningOverlayProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative flex h-32 w-32 items-center justify-center">
        {/* Pulsing animation circles */}
        <div className="absolute h-full w-full rounded-full bg-primary/30 animate-ping"></div>
        <div className="absolute h-2/3 w-2/3 rounded-full bg-primary/50 animate-ping delay-300"></div>
        
        {/* Central mic icon */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Mic className="h-12 w-12" />
        </div>
      </div>
      <p className="mt-6 text-2xl font-semibold text-foreground animate-pulse">
        <T>Listening...</T>
      </p>
    </div>
  );
}

    