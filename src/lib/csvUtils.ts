/**
 * Utility functions for handling CSV data
 */

export interface CSVDownloadOptions {
  filename?: string;
  mimeType?: string;
}

/**
 * Downloads CSV data as a file
 * @param csvData - The CSV data as a string
 * @param options - Download options
 */
export const downloadCSV = (csvData: string, options: CSVDownloadOptions = {}) => {
  const {
    filename = `export-${new Date().toISOString().split('T')[0]}.csv`,
    mimeType = 'text/csv;charset=utf-8;'
  } = options;

  try {
    const blob = new Blob([csvData], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('CSV download error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to download CSV' 
    };
  }
};

/**
 * Validates if a string contains valid CSV data
 * @param csvData - The CSV data to validate
 */
export const validateCSV = (csvData: string): { isValid: boolean; error?: string } => {
  if (!csvData || typeof csvData !== 'string') {
    return { isValid: false, error: 'CSV data is empty or invalid' };
  }

  // Basic validation - check if it has at least one line with commas
  const lines = csvData.trim().split('\n');
  if (lines.length === 0) {
    return { isValid: false, error: 'CSV data is empty' };
  }

  // Check if first line looks like a header (contains commas)
  const firstLine = lines[0];
  if (!firstLine.includes(',')) {
    return { isValid: false, error: 'CSV data does not appear to be properly formatted' };
  }

  return { isValid: true };
};

/**
 * Parses CSV data into an array of objects
 * @param csvData - The CSV data as a string
 */
export const parseCSV = (csvData: string) => {
  const validation = validateCSV(csvData);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim());
  
  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.replace(/"/g, '').trim());
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    return row;
  });

  return { headers, data };
};