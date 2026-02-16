import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emailHeaders, emailBody } = req.body;

  if (!emailBody && !emailHeaders) {
    return res.status(400).json({ error: 'Please provide email content.' });
  }

  const systemPrompt = `
    You are an expert cybersecurity analyst. Analyze the following email headers and body for phishing indicators. 
    Look for domain mismatches, urgency cues, SPF/DKIM/DMARC failures, and suspicious links.
    
    Respond ONLY in valid JSON format using this exact schema:
    {
      "confidenceScore": number (0-100, 100 being definite phishing),
      "verdict": string ("Safe", "Suspicious", or "Phishing"),
      "redFlags": array of strings (specific suspicious findings),
      "safePoints": array of strings (legitimate aspects found),
      "headerAnalysis": string (brief summary of technical origin)
    }

    Email Headers:
    ${emailHeaders || "None provided"}

    Email Body:
    ${emailBody || "None provided"}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (!response.text) throw new Error("No response from AI");

    const resultData = JSON.parse(response.text);
    return res.status(200).json(resultData);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return res.status(500).json({ error: 'Failed to analyze email.' });
  }
}