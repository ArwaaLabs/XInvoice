/**
 * Utility functions for formatting dates and currencies based on locale
 */

// Currency symbols mapping
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  PKR: '₨',
  SAR: 'ر.س',
  AED: 'د.إ',
};

// Locale mapping for different languages
const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  ar: 'ar-SA',
  ur: 'ur-PK',
  hi: 'hi-IN',
};

/**
 * Format currency based on locale and currency code
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string = 'USD',
  locale: string = 'en'
): string => {
  const localeCode = LOCALE_MAP[locale] || 'en-US';
  
  try {
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if currency code is not supported
    const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;
    const formattedNumber = new Intl.NumberFormat(localeCode, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
    
    // For RTL languages, put symbol after the number
    if (locale === 'ar' || locale === 'ur') {
      return `${formattedNumber} ${symbol}`;
    }
    return `${symbol}${formattedNumber}`;
  }
};

/**
 * Format date based on locale
 */
export const formatDate = (
  date: Date | string,
  locale: string = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const localeCode = LOCALE_MAP[locale] || 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(localeCode, options).format(dateObj);
};

/**
 * Format date in short format (e.g., MM/DD/YYYY or DD/MM/YYYY)
 */
export const formatShortDate = (
  date: Date | string,
  locale: string = 'en'
): string => {
  return formatDate(date, locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (
  date: Date | string,
  locale: string = 'en'
): string => {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format number based on locale
 */
export const formatNumber = (
  num: number,
  locale: string = 'en',
  decimals: number = 2
): string => {
  const localeCode = LOCALE_MAP[locale] || 'en-US';
  
  return new Intl.NumberFormat(localeCode, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Get currency symbol for a currency code
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
};

/**
 * Format percentage based on locale
 */
export const formatPercentage = (
  value: number,
  locale: string = 'en'
): string => {
  const localeCode = LOCALE_MAP[locale] || 'en-US';
  
  return new Intl.NumberFormat(localeCode, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

/**
 * Get relative time format (e.g., "2 days ago")
 */
export const formatRelativeTime = (
  date: Date | string,
  locale: string = 'en'
): string => {
  const localeCode = LOCALE_MAP[locale] || 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(localeCode, { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};
