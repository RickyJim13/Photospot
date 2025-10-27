import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { base64Image, mimeType } = req.body || {};
    if (!base64Image) return res.status(400).json({ error: 'Missing image data' });

    // quick size guard (~0.75 bytes per base64 char). Keep under ~4.5MB.
    const approxBytes = Math.floor(base64Image.length * 0.75);
    if (approxBytes > 4_500_000) {
      return res.status(413).json({ error: 'Image too large. Please upload a smaller image.' });
    }

    // TEMP log: confirm env var is present (check logs once)
    console.log('Has API_KEY:', !!process.env.API_KEY);

    const genAI = new GoogleGenerativeAI({ apiKey: process.env.API_KEY! });
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      // Ask Gemini to return JSON natively
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `
      Identify the location in this image. Return a single JSON object with:
      - location_name: string
      - coordinates: string ("lat, lng" if known, else "")
      - confidence: number (0..1)
      - google_maps_url: string (if known, else "")
    `;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: mimeType || 'image/jpeg', data: base64Image } },
    ]);

    // With responseMimeType set, this is already valid JSON:
    const text = result.response.text().trim();
    let payload: any;
    try {
      payload = JSON.parse(text);
    } catch {
      // Fallback: extract JSON if model wrapped it
      const s = text.indexOf('{');
      const e = text.lastIndexOf('}');
      if (s === -1 || e === -1) {
        console.error('Model returned non-JSON:', text);
        return res.status(502).json({ error: 'Model returned unexpected format.' });
      }
      payload = JSON.parse(text.slice(s, e + 1));
    }

    // Light validation so the client doesn’t crash
    if (
      typeof payload.location_name !== 'string' ||
      typeof payload.coordinates !== 'string' ||
      typeof payload.confidence !== 'number'
    ) {
      console.error('Invalid JSON schema from model:', payload);
      return res.status(502).json({ error: 'Invalid model output.' });
    }

    return res.status(200).json(payload);
  } catch (err: any) {
    console.error('Analyze error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}
