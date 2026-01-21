/**
 * CSV Export utility
 */

const exportToCSV = (data, fields) => {
    if (!data || data.length === 0) {
        return '';
    }

    // Create CSV header
    const header = fields.map(field => field.label).join(',');

    // Create CSV rows
    const rows = data.map(item => {
        return fields.map(field => {
            let value = item[field.key];

            // Handle nested objects
            if (field.key.includes('.')) {
                const keys = field.key.split('.');
                value = keys.reduce((obj, key) => obj?.[key], item);
            }

            // Handle dates
            if (value instanceof Date) {
                value = value.toISOString().split('T')[0];
            }

            // Escape commas and quotes
            if (typeof value === 'string') {
                value = `"${value.replace(/"/g, '""')}"`;
            }

            return value || '';
        }).join(',');
    });

    return [header, ...rows].join('\n');
};

module.exports = { exportToCSV };
