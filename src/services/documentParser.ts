import path from 'path';

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

export const extractTextFromFile = async (fileBuffer: Buffer, originalName: string): Promise<string> => {
  const extension = path.extname(originalName).toLowerCase();

  try {
    if (extension === '.pdf') {
      const pdfData = await pdfParse(fileBuffer);
      return pdfData.text;
    } 
    
    if (extension === '.docx') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    }

    throw new Error('Unsupported file format. Please upload a .pdf or .docx file.');
  } catch (error) {
    console.error('Document parsing error:', error);
    throw new Error('Failed to extract text from the document.');
  }
};