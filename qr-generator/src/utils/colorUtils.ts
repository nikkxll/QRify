export function isColorDark(hexColor: string): boolean {
  const hex = hexColor.replace('#', '');
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance: (0.2126 * R + 0.7152 * G + 0.0722 * B)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  
  return luminance < 0.1;
}

export function getContrastColor(bgColor: string): string {
  return isColorDark(bgColor) ? 'BBBBBB' : '000000';
}