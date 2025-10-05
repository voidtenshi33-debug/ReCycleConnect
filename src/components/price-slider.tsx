
"use client"

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PriceSliderProps {
    min: number;
    max: number;
    value: number;
    onValueChange: (value: number) => void;
}

export function PriceSlider({ min, max, value, onValueChange }: PriceSliderProps) {
    
    const handleSliderChange = (values: number[]) => {
        onValueChange(values[0]);
    }
    
    return (
        <div className="space-y-4">
            <div>
                <Label>Set Your Price</Label>
                <p className="text-xs text-muted-foreground">
                    AI Suggestion: ₹{min.toLocaleString('en-IN')} - ₹{max.toLocaleString('en-IN')}
                </p>
            </div>
            <Slider
                min={min}
                max={max}
                step={Math.max(100, Math.round((max - min) / 100))}
                value={[value]}
                onValueChange={handleSliderChange}
            />
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Asking Price</p>
                <p className="text-2xl font-bold">₹{value.toLocaleString('en-IN')}</p>
            </div>
        </div>
    )
}
