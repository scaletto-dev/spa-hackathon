/**
 * I18n Formatting Utilities
 *
 * Provides locale-aware formatting for dates, numbers, and currency
 * using the Intl API based on the current i18n language.
 */

/**
 * Format a date according to the current locale
 */
export function formatDate(
    date: Date | string,
    locale: string,
    options?: Intl.DateTimeFormatOptions
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US';

    return new Intl.DateTimeFormat(localeCode, options).format(dateObj);
}

/**
 * Format a number according to the current locale
 */
export function formatNumber(
    value: number,
    locale: string,
    options?: Intl.NumberFormatOptions
): string {
    const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US';

    return new Intl.NumberFormat(localeCode, options).format(value);
}

/**
 * Format currency (VND) according to the current locale
 */
export function formatCurrency(amount: number, locale: string): string {
    const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US';

    return new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format a percentage according to the current locale
 */
export function formatPercent(
    value: number,
    locale: string,
    options?: Intl.NumberFormatOptions
): string {
    const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US';

    return new Intl.NumberFormat(localeCode, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
    }).format(value);
}
