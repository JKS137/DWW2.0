/**
 * Formats a date string for display using locale-specific formatting
 */
export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
};

/**
 * Formats a date string for display with fallback
 */
export const formatDateWithFallback = (dateString: string | null | undefined, fallback = 'N/A'): string => {
    if (!dateString) return fallback;
    return new Date(dateString).toLocaleDateString();
};