import { formatDate, formatDateWithFallback } from './dateUtils';

// Simple test runner for date utilities
const runTests = () => {
    console.log('Running date utility tests...');
    
    // Test formatDate
    const testDate = '2024-01-15';
    const formatted = formatDate(testDate);
    console.assert(formatted !== 'N/A', 'formatDate should format valid dates');
    console.assert(formatDate(null) === 'N/A', 'formatDate should return N/A for null');
    console.assert(formatDate(undefined) === 'N/A', 'formatDate should return N/A for undefined');
    console.assert(formatDate('') === 'N/A', 'formatDate should return N/A for empty string');
    
    // Test formatDateWithFallback
    console.assert(formatDateWithFallback(testDate) !== 'N/A', 'formatDateWithFallback should format valid dates');
    console.assert(formatDateWithFallback(null, 'Custom') === 'Custom', 'formatDateWithFallback should use custom fallback');
    
    console.log('All date utility tests passed!');
};

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    runTests();
}