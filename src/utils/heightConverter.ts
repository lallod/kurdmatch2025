/**
 * Height utilities - CM ONLY
 * All heights must be stored and displayed in centimeters
 */

/**
 * Parses height string and extracts cm value
 * Supports: "178 cm", "178cm", "178"
 */
export const parseHeightToCm = (height: string): number => {
  if (!height) return 0;

  // Extract number from string (handles "178 cm", "178cm", "178")
  const numMatch = height.match(/(\d+)/);
  if (numMatch) {
    return parseInt(numMatch[1]);
  }

  return 0;
};

/**
 * Formats height in centimeters for display (CM ONLY)
 */
export const formatHeightCm = (heightCm: number | string): string => {
  // If already a string with "cm", return as is
  if (typeof heightCm === 'string') {
    if (heightCm.includes('cm')) return heightCm;
    // If it's a number string, convert it
    const num = parseInt(heightCm);
    if (!isNaN(num)) return `${num} cm`;
  }
  
  if (typeof heightCm === 'number') {
    if (!heightCm || heightCm === 0) return 'Not specified';
    return `${heightCm} cm`;
  }
  
  return 'Not specified';
};

/**
 * Formats height string ensuring CM format
 */
export const convertAndFormatHeight = (height: string): string => {
  if (!height) return 'Not specified';
  
  // If already properly formatted with cm, return as is
  if (height.toLowerCase().includes('cm')) return height;
  
  // Otherwise, parse and format
  const heightCm = parseHeightToCm(height);
  return formatHeightCm(heightCm);
};
