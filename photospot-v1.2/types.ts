/// <reference types="react" />

// FIX: Added a triple-slash directive to ensure React's global JSX type definitions
// are loaded. This resolves errors where standard HTML/SVG elements were not
// recognized in TSX files.
import React from 'react';

export type AppState = 'landing' | 'upload' | 'processing' | 'results';

export interface LocationAnalysis {
  location_name: string;
  coordinates: string;
  confidence: number;
}

declare global {
  // Add gtag to the window interface for Google Analytics
  interface Window {
    gtag?: (command: string, action: string, params?: { [key: string]: any }) => void;
  }
  
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}
