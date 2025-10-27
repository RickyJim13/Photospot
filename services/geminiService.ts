
import { LocationAnalysis } from '../types';

/**
 * Makes a request to our own secure backend endpoint to analyze an image.
 * The backend then calls the Gemini API, keeping the API key safe.
 * @param base64Image The base64-encoded image data.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves to the location analysis.
 */
export const analyzeImageForLocation = async (
  base64Image: string,
  mimeType: string
): Promise<LocationAnalysis> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ base64Image, mimeType }),
  });

  const result = await response.json();

  if (!response.ok) {
    // If the server responded with an error, the message will be in result.error
    throw new Error(result.error || `Failed to analyze image. Server responded with status ${response.status}`);
  }

  // A light validation on the client-side as a safeguard
  if (
    typeof result.location_name !== 'string' ||
    typeof result.coordinates !== 'string' ||
    typeof result.confidence !== 'number'
  ) {
    throw new Error('Invalid JSON structure received from the backend.');
  }

  return result as LocationAnalysis;
};
