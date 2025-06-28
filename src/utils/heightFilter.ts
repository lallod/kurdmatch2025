
import { heightRanges } from '@/components/filters/HeightFilter';

export const matchesHeightRange = (profileHeight: string | undefined, selectedRange: string | undefined): boolean => {
  if (!selectedRange || !profileHeight) return true;
  
  // Extract numeric value from profile height (e.g., "175 cm" -> 175)
  const heightMatch = profileHeight.match(/(\d+)/);
  if (!heightMatch) return true;
  
  const height = parseInt(heightMatch[1], 10);
  const range = heightRanges.find(r => r.value === selectedRange);
  
  if (!range) return true;
  
  return height >= range.min && height <= range.max;
};

export const categorizeHeight = (height: string | undefined): string => {
  if (!height) return 'Not specified';
  
  const heightMatch = height.match(/(\d+)/);
  if (!heightMatch) return 'Not specified';
  
  const heightValue = parseInt(heightMatch[1], 10);
  
  for (const range of heightRanges) {
    if (heightValue >= range.min && heightValue <= range.max) {
      return range.label;
    }
  }
  
  return 'Not specified';
};
