
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000'];
const colorNames = ['Red', 'Green', 'Blue', 'White', 'Black'];

interface ScreenHealthCheckProps {
  onComplete: () => void;
}

export function ScreenHealthCheck({ onComplete }: ScreenHealthCheckProps) {
  const [colorIndex, setColorIndex] = useState(0);

  const handleNextColor = () => {
    if (colorIndex < colors.length - 1) {
      setColorIndex(colorIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-white transition-colors duration-300"
      style={{ backgroundColor: colors[colorIndex] }}
    >
      <div className="absolute top-8 left-8 text-lg" style={{ color: colorIndex >= 3 ? '#888' : '#FFF' }}>
        Step 1: Screen Health Check
      </div>
       <div className="absolute top-8 right-8">
        <Button variant="ghost" onClick={onComplete} className="text-white hover:bg-white/20 hover:text-white">
            <X className="mr-2 h-4 w-4" /> Exit
        </Button>
      </div>
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold" style={{ color: colorIndex >= 3 ? '#888' : '#FFF' }}>
          Look for dead pixels or discoloration.
        </h1>
        <p className="text-xl" style={{ color: colorIndex >= 3 ? '#AAA' : '#EEE' }}>
          Currently displaying: <strong>{colorNames[colorIndex]}</strong>
        </p>
      </div>

      <div className="absolute bottom-8 w-full px-8">
        <Button
          onClick={handleNextColor}
          className="w-full bg-white/30 text-white backdrop-blur-md hover:bg-white/50"
          size="lg"
        >
          {colorIndex < colors.length - 1 ? 'Next Color' : 'Finish Test'}
          <Check className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
