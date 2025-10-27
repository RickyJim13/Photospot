// FIX: Replaced the triple-slash directive with a direct import for 'react'.
// This ensures that React's global JSX type definitions are loaded correctly
// before augmenting the JSX.IntrinsicElements interface. By explicitly loading
// React's types, we prevent our custom element definition from overwriting
// the standard HTML element types, which resolves all JSX-related errors
// across the application.
import 'react';

export type AppState = 'landing' | 'upload' | 'processing' | 'results' | 'terms' | 'privacy';

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
