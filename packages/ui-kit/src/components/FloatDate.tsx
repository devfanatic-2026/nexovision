import React from 'react';
import { Text, StyleSheet } from '@float.js/core';
import type { TextStyle } from '@float.js/core';

export interface FloatDateProps {
    date: string | number | Date | null | undefined;
    locale?: string;
    options?: Intl.DateTimeFormatOptions;
    format?: 'short' | 'medium' | 'long' | 'full' | 'relative';
    style?: TextStyle;
    className?: string; // For CSS classes if needed (web)
}

export const FloatDate: React.FC<FloatDateProps> = ({
    date,
    locale = 'es-ES',
    options,
    format,
    style,
    className
}) => {
    if (!date) return null;

    let dateObj: Date;

    try {
        if (date instanceof Date) {
            dateObj = date;
        } else if (typeof date === 'number') {
            dateObj = new Date(date);
        } else {
            // Check if string is a numeric timestamp (integer or float string)
            // Matches "123", "123.0", "123.456"
            if (/^-?\d+(\.\d+)?$/.test(date)) {
                dateObj = new Date(parseFloat(date));
            } else {
                dateObj = new Date(date);
            }
        }

        if (isNaN(dateObj.getTime())) {
            console.warn('[FloatDate] Invalid date:', date);
            return <Text style={[styles.text, style]}>{String(date)}</Text>;
        }
    } catch (e) {
        console.error('[FloatDate] Error parsing date:', e);
        return <Text style={[styles.text, style]}>{String(date)}</Text>;
    }

    // Predefined formats
    let formatOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    if (format === 'short') {
        formatOptions = { dateStyle: 'short' };
    } else if (format === 'medium') {
        formatOptions = { dateStyle: 'medium' };
    } else if (format === 'long') {
        formatOptions = { dateStyle: 'long' };
    } else if (format === 'full') {
        formatOptions = { dateStyle: 'full' };
    }

    // Allow override
    if (options) {
        formatOptions = options;
    }

    // Relative time check (simplified for now)
    if (format === 'relative') {
        // TODO: Implement proper RelativeTimeFormat logic
    }

    // Validate locale to prevent empty string errors and handle invalid locales
    const validLocale = locale && locale.trim() !== '' ? locale : 'es-ES';

    let formatted: string;
    try {
        formatted = new Intl.DateTimeFormat(validLocale, formatOptions).format(dateObj);
    } catch (error) {
        // If locale is invalid, fallback to default
        console.warn(`[FloatDate] Invalid locale "${validLocale}", using fallback "es-ES"`);
        formatted = new Intl.DateTimeFormat('es-ES', formatOptions).format(dateObj);
    }

    return (
        <Text style={[styles.text, style]} className={className} selectable={true}>
            {formatted}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        color: '#6b7280',
    }
});
