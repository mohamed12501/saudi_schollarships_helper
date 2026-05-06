import * as XLSX from 'xlsx';

export const parseExcelFile = async (filePath) => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData.map((row, index) => {
      // Normalize empty values and parse JSON-like fields
      const parseList = (field) => {
        if (!field) return [];
        
        // If it's already an array, flatten and parse each element
        if (Array.isArray(field)) {
          return field.flatMap(item => parseList(item));
        }

        if (typeof field === 'string') {
          // Handle potential JSON strings
          if (field.startsWith('[') && field.endsWith(']')) {
            try {
              const parsed = JSON.parse(field.replace(/'/g, '"'));
              return parseList(parsed);
            } catch (e) {
              // Not valid JSON, continue to string parsing
            }
          }

          // Split by newline, bullet points (•, - at start of line, etc.)
          return field
            .split(/\r?\n|•|(?:\n|^)\s*-\s+/)
            .map(item => item.trim())
            .filter(item => item && item !== '-' && item !== '["' && item !== '"]');
        }
        
        return [String(field)];
      };

      return {
        id: row.id || index.toString(),
        url: row.url || '',
        degree: row.degree || 'N/A',
        nameAr: row.nameAr || '',
        nameEn: row.nameEn || '',
        institution: row.institution || 'Unknown Institution',
        city: row.city || 'Unknown City',
        gender: row.gender || 'Both',
        language: row.language || 'Arabic',
        studentType: row.studentType || 'Both',
        scholarship: row.scholarship || 'No',
        originalPrice: row.originalPrice || '',
        currentPrice: row.currentPrice || '',
        duration: row.duration || 'N/A',
        benefits: parseList(row.benefits),
        conditions: parseList(row.conditions),
        requiredAttachments: parseList(row.requiredAttachments),
      };
    });
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw error;
  }
};
