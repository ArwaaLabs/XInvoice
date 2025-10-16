/**
 * Utility functions for detecting text direction and language
 */

// Unicode ranges for different scripts
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const URDU_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/; // Same as Arabic
const DEVANAGARI_REGEX = /[\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF]/;
const HEBREW_REGEX = /[\u0590-\u05FF\uFB1D-\uFB4F]/;

/**
 * Detect if text contains RTL (Right-to-Left) characters
 */
export function containsRTL(text: string): boolean {
  if (!text) return false;
  return ARABIC_REGEX.test(text) || URDU_REGEX.test(text) || HEBREW_REGEX.test(text);
}

/**
 * Detect if text contains Arabic characters
 */
export function containsArabic(text: string): boolean {
  if (!text) return false;
  return ARABIC_REGEX.test(text);
}

/**
 * Detect if text contains Devanagari (Hindi) characters
 */
export function containsDevanagari(text: string): boolean {
  if (!text) return false;
  return DEVANAGARI_REGEX.test(text);
}

/**
 * Automatically detect the text direction based on content
 */
export function detectTextDirection(text: string): 'ltr' | 'rtl' {
  if (!text) return 'ltr';
  
  // Count RTL characters
  const rtlChars = (text.match(/[\u0600-\u06FF\u0590-\u05FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFB4F\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  
  // If more than 30% of characters are RTL, consider it RTL text
  const threshold = text.length * 0.3;
  return rtlChars > threshold ? 'rtl' : 'ltr';
}

/**
 * Get appropriate font family based on detected script
 */
export function detectFontFamily(text: string): string {
  if (!text) return '';
  
  if (containsArabic(text)) {
    // Check if it's more likely Urdu (has specific Urdu characters)
    const urduSpecificChars = /[\u0679\u067E\u0688\u0691\u06BA\u06BE\u06C1\u06C3]/;
    if (urduSpecificChars.test(text)) {
      return "'Noto Nastaliq Urdu', sans-serif";
    }
    return "'Noto Sans Arabic', sans-serif";
  }
  
  if (containsDevanagari(text)) {
    return "'Noto Sans Devanagari', sans-serif";
  }
  
  return '';
}

/**
 * Get CSS properties for multilingual text
 */
export function getMultilingualStyles(text: string): React.CSSProperties {
  const direction = detectTextDirection(text);
  const fontFamily = detectFontFamily(text);
  
  const styles: React.CSSProperties = {};
  
  if (direction === 'rtl') {
    styles.direction = 'rtl';
    styles.textAlign = 'right';
  }
  
  if (fontFamily) {
    styles.fontFamily = fontFamily;
  }
  
  return styles;
}

/**
 * Hook to track and update input direction based on content
 */
export function useAutoDirection(value: string | undefined): {
  dir: 'ltr' | 'rtl';
  style: React.CSSProperties;
} {
  const dir = detectTextDirection(value || '');
  const style = getMultilingualStyles(value || '');
  
  return { dir, style };
}
