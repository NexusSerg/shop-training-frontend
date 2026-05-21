'use client';
// TODO Step 2.5: debounced dual-handle slider, sync with URL price_min/price_max
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

export function PriceRangeSlider() {
  const [range, setRange] = useState([0, 5000]);
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Price</h3>
      <Slider
        min={0}
        max={5000}
        step={10}
        value={range}
        onValueChange={(val) => setRange(Array.isArray(val) ? [...val] : [val as number, val as number])}
        className="mb-2"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>${range[0]}</span>
        <span>${range[1]}</span>
      </div>
      {/* TODO Step 2.5: debounce + write to URL */}
    </div>
  );
}
