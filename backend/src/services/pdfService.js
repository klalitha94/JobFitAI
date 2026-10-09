import pdfParse from 'pdf-parse';

export const extractTextFromPdf = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    const cleanedText = (data.text || '')
      .replace(/\r\n/g, '\n')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    if (cleanedText.length > 20) {
      return {
        text: cleanedText,
        numPages: data.numpages || 1,
        info: data.info || {},
      };
    }
  } catch (error) {
    console.warn('[PdfService] pdf-parse parser notice:', error.message);
  }

  // Resilient fallback: extract visible text streams from buffer
  try {
    const rawString = pdfBuffer.toString('latin1');
    const textMatches = [];
    const streamRegex = /\(([^)]+)\)\s*Tj|\[([^\]]+)\]\s*TJ/g;
    let match;
    while ((match = streamRegex.exec(rawString)) !== null) {
      if (match[1]) textMatches.push(match[1]);
      if (match[2]) {
        // TJ array items
        const sub = match[2].replace(/\([^)]*\)/g, (m) => m.slice(1, -1));
        textMatches.push(sub);
      }
    }

    if (textMatches.length > 0) {
      const extracted = textMatches.join(' ').replace(/\\(\d{3}|[\\()])/g, '').trim();
      return {
        text: extracted,
        numPages: 1,
        info: {},
      };
    }

    // Last resort: extract printable ASCII characters
    const ascii = pdfBuffer.toString('utf8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    const sanitized = ascii.replace(/\s+/g, ' ').trim();
    if (sanitized.length > 50) {
      return {
        text: sanitized,
        numPages: 1,
        info: {},
      };
    }
  } catch (fallbackError) {
    console.error('[PdfService] Fallback extraction failed:', fallbackError);
  }

  throw new Error('Unable to extract readable text from this PDF file.');
};
