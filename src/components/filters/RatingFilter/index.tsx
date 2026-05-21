'use client';
// TODO Step 2.5: sync with URL rating= parameter
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@radix-ui/react-label';

const OPTIONS = [4, 3, 2, 1];

export function RatingFilter() {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Rating</h3>
      <RadioGroup>
        {OPTIONS.map((r) => (
          <div key={r} className="flex items-center gap-2">
            <RadioGroupItem value={String(r)} id={`rating-${r}`} />
            <Label htmlFor={`rating-${r}`} className="text-sm cursor-pointer">
              {'★'.repeat(r)}{'☆'.repeat(5 - r)} &amp; up
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
