
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function extractDocumentContent(
  imageData: string,
  targetFormat: 'DOC' | 'EXCEL'
) {
  const model = 'gemini-3-flash-preview';
  
  const prompt = targetFormat === 'EXCEL' 
    ? "Analyze this document image and extract all table data into a structured JSON format. Identify columns and rows accurately."
    : "Analyze this document image and extract all text content while maintaining the hierarchical structure (headings, paragraphs, lists) in a clean JSON format.";

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/png', data: imageData.split(',')[1] } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: targetFormat === 'EXCEL' ? {
        type: Type.OBJECT,
        properties: {
          tables: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tableName: { type: Type.STRING },
                rows: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      } : {
        type: Type.OBJECT,
        properties: {
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: 'heading1, heading2, paragraph, or list' },
                content: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function performOCR(imageData: string): Promise<string> {
  const model = 'gemini-3-flash-preview';
  const prompt = "Act as an OCR engine. Extract all readable text from this image exactly as it appears. Return only the extracted text without any commentary.";

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/png', data: imageData.split(',')[1] } },
        { text: prompt }
      ]
    }
  });

  return response.text || "";
}
