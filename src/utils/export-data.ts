/**
 * Utility functions for exporting data from the admin dashboard
 */

/**
 * Convert an array of objects to CSV format
 * @param data Array of objects to convert
 * @param headers Optional custom headers (if not provided, will use object keys)
 * @returns CSV string
 */
export function convertToCSV(data: any[], headers?: string[]) {
  if (data.length === 0) return '';

  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  let csvString = csvHeaders.join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = csvHeaders.map(header => {
      // Get the value (using header as key or finding matching property)
      const key = Object.keys(item).find(k => k.toLowerCase() === header.toLowerCase()) || header;
      const value = item[key];
      
      // Handle different value types
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma or newline
        const escaped = value.replace(/"/g, '""');
        return (escaped.includes(',') || escaped.includes('\n')) ? `"${escaped}"` : escaped;
      }
      return String(value);
    }).join(',');
    
    csvString += row + '\n';
  });
  
  return csvString;
}

/**
 * Export data as a CSV file
 * @param data Array of objects to export
 * @param filename Filename for the downloaded file
 * @param headers Optional custom headers
 */
export function exportToCSV(data: any[], filename: string, headers?: string[]) {
  // Convert data to CSV
  const csvContent = convertToCSV(data, headers);
  
  // Create a Blob with the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add to document, click to download, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data as a JSON file
 * @param data Data to export
 * @param filename Filename for the downloaded file
 */
export function exportToJSON(data: any, filename: string) {
  // Convert data to JSON string
  const jsonContent = JSON.stringify(data, null, 2);
  
  // Create a Blob with the JSON data
  const blob = new Blob([jsonContent], { type: 'application/json' });
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add to document, click to download, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format current date as YYYY-MM-DD for filenames
 * @returns Formatted date string
 */
export function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
