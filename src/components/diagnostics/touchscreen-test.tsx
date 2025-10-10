
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Progress } from '../ui/progress';

interface TouchscreenTestProps {
  onComplete: () => void;
}

const GRID_SIZE = 10; // 10x10 grid

export function TouchscreenTest({ onComplete }: TouchscreenTestProps) {
  const [grid, setGrid] = useState<boolean[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const totalCells = GRID_SIZE * GRID_SIZE;
  const filledCells = grid.flat().filter(Boolean).length;
  const progress = (filledCells / totalCells) * 100;

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDrawing) {
      handleInteraction(e.clientX, e.clientY);
    }
  };

  const handleInteraction = (x: number, y: number) => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    const rect = gridEl.getBoundingClientRect();
    const col = Math.floor(((x - rect.left) / rect.width) * GRID_SIZE);
    const row = Math.floor(((y - rect.top) / rect.height) * GRID_SIZE);

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      if (!grid[row][col]) {
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(r => [...r]);
          newGrid[row][col] = true;
          return newGrid;
        });
      }
    }
  };

   useEffect(() => {
    if (filledCells === totalCells) {
      setTimeout(() => {
        onComplete();
      }, 500); // Give user a moment to see the completed grid
    }
  }, [filledCells, totalCells, onComplete]);


  return (
    <div className="fixed inset-0 z-50 bg-background p-4 sm:p-8 flex flex-col">
       <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Step 2: Touchscreen Test</div>
        <Button variant="ghost" onClick={onComplete}>
            <X className="mr-2 h-4 w-4" /> Exit Test
        </Button>
      </div>

       <div className="text-center mb-4">
          <h1 className="text-xl md:text-2xl font-bold">Trace your finger over the entire grid.</h1>
          <p className="text-muted-foreground">This will check for any unresponsive "dead zones" on the screen.</p>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div
            ref={gridRef}
            className="grid w-full max-w-lg aspect-square border-2 border-dashed touch-none"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            onTouchStart={() => setIsDrawing(true)}
            onTouchEnd={() => setIsDrawing(false)}
            onMouseDown={() => setIsDrawing(true)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            onTouchMove={handleTouchMove}
            onMouseMove={handleMouseMove}
        >
            {grid.map((row, rowIndex) =>
            row.map((isFilled, colIndex) => (
                <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                    'border border-muted transition-colors',
                    isFilled ? 'bg-primary' : 'bg-background'
                )}
                />
            ))
            )}
        </div>
      </div>
      <div className="mt-4">
          <Progress value={progress} />
          <p className="text-center text-sm text-muted-foreground mt-2">{Math.round(progress)}% Complete</p>
      </div>
    </div>
  );
}
