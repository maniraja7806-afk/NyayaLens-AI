import { PDFParse } from 'pdf-parse';

/**
 * Extracts text from a PDF Buffer
 * Note: In a production OCR environment, this would handle images as well.
 */
export async function extractTextFromPdf(fileBuffer: Buffer): Promise<string> {
  try {
    // @ts-expect-error - PDFParse is callable at runtime despite TS type claiming otherwise
    const data = await PDFParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to parse PDF document");
  }
}
