import { GoogleGenAI, Type, Schema } from '@google/genai';
import { DocumentAnalysis } from '../types';

export async function analyzeDocumentContent(text: string, filename: string, inlineData?: { data: string, mimeType: string }): Promise<Omit<DocumentAnalysis, 'documentId'>> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  // Define structured output schema to force Gemini to return strictly typed JSON
  const analysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "A short, plain-language summary of the entire document. Explain it in simple terms."
      },
      documentType: {
        type: Type.STRING,
        description: "Classify the document (e.g., Rental Agreement, Employment Contract, Government Notice, Unknown)"
      },
      confidence: {
        type: Type.NUMBER,
        description: "Confidence score from 0.0 to 1.0 of the classification and analysis."
      },
      clauses: {
        type: Type.ARRAY,
        description: "List of extracted clauses categorized for importance.",
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { 
              type: Type.STRING,
              description: "Must be one of: PAYMENT, OBLIGATION, TERMINATION, PENALTY, DEADLINE, PRIVACY, RENEWAL, RESTRICTION, RESPONSIBILITY, OTHER"
            },
            originalText: { type: Type.STRING },
            explanation: { 
              type: Type.STRING,
              description: "Extremely simple plain-language explanation of this clause."
            },
            attentionLevel: { 
              type: Type.STRING,
              description: "Must be one of: informational, review, important, critical"
            },
            attentionReason: {
              type: Type.STRING,
              description: "Why this clause got this attention level."
            },
            confidence: { type: Type.NUMBER }
          },
          required: ["title", "category", "originalText", "explanation", "attentionLevel", "confidence"]
        }
      },
      importantDates: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            event: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["date", "event", "description"]
        }
      },
      actionPlan: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            task: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["task", "reason"]
        }
      }
    },
    required: ["summary", "documentType", "confidence", "clauses", "importantDates", "actionPlan"]
  };

  const promptText = `
    You are NyayaLens AI, an expert document intelligence engine.
    Analyze the following extracted document named "${filename}".
    Your goal is to explain it clearly to a standard citizen, identify important clauses, highlight risks (AttentionLevel), and generate an action plan.
    DO NOT provide legal advice. Use cautious phrasing like "may require attention".
    
    ${text ? `Document Text:\n---\n${text.substring(0, 30000)}\n---` : 'Please analyze the provided image.'}
  `;
  
  const contents: any[] = [];
  if (inlineData) {
    contents.push({ role: 'user', parts: [
      { inlineData },
      { text: promptText }
    ]});
  } else {
    contents.push({ role: 'user', parts: [ { text: promptText } ]});
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.1, // Low temperature for factual extraction
      }
    });

    if (!response.text) {
        throw new Error("Empty response from AI");
    }

    const parsedData = JSON.parse(response.text);
    return parsedData as Omit<DocumentAnalysis, 'documentId'>;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze document with AI.");
  }
}
