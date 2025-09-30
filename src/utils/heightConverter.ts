/**
 * Height conversion utilities
 */

/**
 * Converts feet and inches to centimeters
 */
export const feetInchesToCm = (feet: number, inches: number): number => {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
};

/**
 * Parses height string in various formats and converts to cm
 * Supports: "5'10"", "5'10", "5ft 10in", "178cm", "178"
 */
export const parseHeightToCm = (height: string): number => {
  if (!height) return 0;

  // Already in cm format (e.g., "178cm" or "178")
  const cmMatch = height.match(/^(\d+)(?:cm)?$/);
  if (cmMatch) {
    return parseInt(cmMatch[1]);
  }

  // Feet and inches format (e.g., "5'10"" or "5'10")
  const feetInchesMatch = height.match(/(\d+)[''](\d+)/);
  if (feetInchesMatch) {
    const feet = parseInt(feetInchesMatch[1]);
    const inches = parseInt(feetInchesMatch[2]);
    return feetInchesToCm(feet, inches);
  }

  // Feet format with ft/in (e.g., "5ft 10in")
  const ftInMatch = height.match(/(\d+)ft\s*(\d+)in/);
  if (ftInMatch) {
    const feet = parseInt(ftInMatch[1]);
    const inches = parseInt(ftInMatch[2]);
    return feetInchesToCm(feet, inches);
  }

  // Default: try to parse as number
  const numMatch = height.match(/\d+/);
  if (numMatch) {
    const value = parseInt(numMatch[0]);
    // If value is less than 100, assume it's feet and convert
    if (value < 10) {
      return feetInchesToCm(value, 0);
    }
    return value;
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
 * Converts a height string to cm and formats it (CM ONLY OUTPUT)
 */
export const convertAndFormatHeight = (height: string): string => {
  // If already in cm format, return as is
  if (height && height.includes('cm')) return height;
  
  const heightCm = parseHeightToCm(height);
  return formatHeightCm(heightCm);
};
