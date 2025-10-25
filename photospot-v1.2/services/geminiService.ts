

import { GoogleGenAI, Type } from "@google/genai";
import { LocationAnalysis } from '../types';

// FIX: The hardcoded API key placeholder and related warnings have been removed.
// The API key is now sourced exclusively from the `process.env.API_KEY`
// environment variable as required by the coding guidelines.


const locationSchema = {
  type: Type.OBJECT,
  properties: {
    location_name: {
      type: Type.STRING,
      description: "The most likely city, landmark, or specific location name of where the photo was taken. e.g., 'Eiffel Tower, Paris, France'",
    },
    coordinates: {
      type: Type.STRING,
      description: "The GPS coordinates as a string 'latitude, longitude'. e.g., '48.8584, 2.2945'",
    },
    confidence: {
      type: Type.NUMBER,
      description: "A confidence score between 0.0 and 1.0 representing how certain the model is about the location.",
    },
  },
  required: ["location_name", "coordinates", "confidence"],
};

export const analyzeImageForLocation = async (
  base64Image: string,
  mimeType: string
): Promise<LocationAnalysis> => {
  // FIX: The GoogleGenAI client is now initialized directly with the API key from
  // the environment variable. The previous placeholder check has been removed.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = "Identify where this photo was taken. Return the most likely city, landmark, GPS coordinates, and a confidence score in JSON format.";

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
        parts: [
            { text: prompt },
            { inlineData: { data: base64Image, mimeType: mimeType } }
        ]
    },
    config: {
        responseMimeType: "application/json",
        responseSchema: locationSchema
    }
  });
  
  const jsonString = response.text.trim();
  const result = JSON.parse(jsonString);

  // Validate the result structure
  if (
    typeof result.location_name !== 'string' ||
    typeof result.coordinates !== 'string' ||
    typeof result.confidence !== 'number'
  ) {
    throw new Error('Invalid JSON structure received from API.');
  }

  return result as LocationAnalysis;
};
