/**
 * Formatting Utilities
 *
 * Helper functions for formatting prices, dates, durations, etc.
 */

/**
 * Format price from string to VND currency format
 * @param price - Price as string (e.g., "2500000")
 * @returns Formatted price (e.g., "2.500.000 ₫")
 */
export function formatPrice(price: string | number): string {
    const num = typeof price === 'string' ? parseInt(price, 10) : price;
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(num);
}

/**
 * Format duration to human-readable string
 * @param duration - Duration in minutes
 * @returns Formatted duration (e.g., "90 phút")
 */
export function formatDuration(duration: number): string {
    if (duration < 60) {
        return `${duration} phút`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (minutes === 0) {
        return `${hours} giờ`;
    }
    return `${hours} giờ ${minutes} phút`;
}

/**
 * Operating hours structure
 */
interface OperatingHoursEntry {
    open?: string;
    close?: string;
}

/**
 * Format operating hours object to readable string
 * @param hours - Operating hours JSON object
 * @returns Formatted hours (e.g., "Thứ 2-6: 9:00-18:00")
 */
export function formatOperatingHours(hours: Record<string, OperatingHoursEntry> | unknown): string {
    if (!hours || typeof hours !== 'object') {
        return 'Liên hệ để biết giờ làm việc';
    }

    const hoursObj = hours as Record<string, OperatingHoursEntry>;

    // Try to format as a simple range if all weekdays have same hours
    const monday = hoursObj.monday || hoursObj.Monday || hoursObj.mon;
    if (monday && monday.open && monday.close) {
        return `Thứ 2-6: ${monday.open}-${monday.close}`;
    }

    return 'Liên hệ để biết giờ làm việc';
}

/**
 * Format date to Vietnamese locale
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
    };
    return new Intl.DateTimeFormat('vi-VN', defaultOptions).format(dateObj);
}

/**
 * Format phone number to Vietnamese format
 * @param phone - Phone number string
 * @returns Formatted phone (e.g., "0901 234 567")
 */
export function formatPhone(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as: 0XXX XXX XXX
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }

    // Format as: 0XX XXX XXXX (for 9 digits)
    if (cleaned.length === 9) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }

    return phone; // Return original if format not recognized
}

/**
 * Format review date to relative time (Vietnamese)
 * @param dateString - ISO date string
 * @returns Formatted relative date string
 */
export function formatReviewDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        return 'Hôm nay';
    } else if (diffInDays === 1) {
        return 'Hôm qua';
    } else if (diffInDays < 7) {
        return `${diffInDays} ngày trước`;
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} tuần trước`;
    } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `${months} tháng trước`;
    } else {
        return date.toLocaleDateString('vi-VN');
    }
}
