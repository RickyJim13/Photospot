

import React, { useState, useCallback, useEffect } from 'react';
import { AppState, LocationAnalysis } from './types';
import LandingScreen from './components/LandingScreen';
import UploadScreen from './components/UploadScreen';
import ProcessingScreen from './components/ProcessingScreen';
import ResultsScreen from './components/ResultsScreen';
import Footer from './components/Footer';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import { analyzeImageForLocation } from './services/geminiService';
import { trackEvent } from './services/analytics';

const CREDITS_STORAGE_KEY = 'photospotCredits';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [previousAppState, setPreviousAppState] = useState<AppState>('landing');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<LocationAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(0);
  const [creditConsumed, setCreditConsumed] = useState<boolean | null>(null);

  useEffect(() => {
    trackEvent('page_view'); // Track initial page load
  }, []);

  // Load credits from localStorage and check for purchase success on initial load
  useEffect(() => {
    // Load initial credits
    const savedCredits = parseInt(localStorage.getItem(CREDITS_STORAGE_KEY) || '1', 10);
    setCredits(savedCredits);

    // Check for purchase success in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('purchase') === 'success') {
      const newCredits = parseInt(urlParams.get('credits') || '0', 10);
      if (newCredits > 0) {
        addCredits(newCredits);
        // Track successful purchase
        trackEvent('purchase', {
            value: newCredits === 5 ? 4.95 : 9.99,
            currency: 'USD',
            items: [{
                item_id: `credits_${newCredits}`,
                item_name: `${newCredits} Credits Pack`,
                price: newCredits === 5 ? 4.95 : 9.99,
                quantity: 1
            }]
        });
      }
      // Clean the URL to prevent re-adding credits on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const addCredits = (amount: number) => {
    setCredits(prevCredits => {
        const updatedCredits = prevCredits + amount;
        localStorage.setItem(CREDITS_STORAGE_KEY, updatedCredits.toString());
        return updatedCredits;
    });
  };

  const useCredit = () => {
    setCredits(prevCredits => {
        const updatedCredits = Math.max(0, prevCredits - 1);
        localStorage.setItem(CREDITS_STORAGE_KEY, updatedCredits.toString());
        return updatedCredits;
    });
  }

  const runAnalysis = useCallback(async (base64Image: string, mimeType: string, displaySrc: string, consumeCredit: boolean) => {
    setImageSrc(displaySrc);
    setAppState('processing');
    setError(null);

    try {
      const result = await analyzeImageForLocation(base64Image, mimeType);
      setAnalysisResult(result);
      setAppState('results');
      
      let creditWasConsumed = false;
      if (consumeCredit) {
        // User upload flow
        if (result.confidence >= 0.8) {
          useCredit();
          setCreditConsumed(true);
          creditWasConsumed = true;
        } else {
          // Low confidence, free analysis for user
          setCreditConsumed(false);
        }
      } else {
        // Example photo flow - always free, credit system not applicable
        setCreditConsumed(null);
      }

      trackEvent('analysis_success', { 
        location_name: result.location_name, 
        confidence: result.confidence,
        credit_consumed: creditWasConsumed
      });
    } catch (e: any) {
      console.error(e);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (e instanceof Error) {
        if (e.message.includes('Invalid JSON structure')) {
          errorMessage = "The analysis service returned an unexpected result. Please try another photo.";
        } else {
          errorMessage = `Sorry, I couldn't figure that one out. The location might be too obscure or the image unclear. Please try another photo.`;
        }
      }
      setError(errorMessage);
      setAppState('upload');
      trackEvent('analysis_failure', { error_message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [useCredit]);
  
  const handleFindSpot = useCallback(async (base64Image: string, mimeType: string, displaySrc: string) => {
    if (credits <= 0) {
        setError("You don't have enough credits. Please purchase a pack to continue.");
        setAppState('upload');
        return;
    }
    setIsLoading(true);
    setError(null);
    await runAnalysis(base64Image, mimeType, displaySrc, true);
  }, [runAnalysis, credits]);

  const blobToBase64 = (blob: Blob): Promise<{ base64: string; displaySrc: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const displaySrc = reader.result as string;
            const base64 = displaySrc.split(',')[1];
            resolve({ base64, displaySrc, mimeType: blob.type });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
    });
  };

  const handleSelectExample = useCallback(async (imageUrl: string) => {
    setIsLoading(true);
    setError(null);
    setAppState('processing');

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        const imageBlob = await response.blob();
        const { base64, displaySrc, mimeType } = await blobToBase64(imageBlob);
        await runAnalysis(base64, mimeType, displaySrc, false); // Examples are free
    } catch (e: any) {
        console.error("Failed to process example image:", e);
        setError("Could not load the example image. Please check your network connection or try uploading a file instead.");
        setAppState('upload');
        setIsLoading(false);
    }
  }, [runAnalysis]);

  const handleTryAnother = () => {
    setAppState('upload');
    setImageSrc(null);
    setAnalysisResult(null);
    setError(null);
    setCreditConsumed(null);
  };
  
  const handleBackToHome = () => {
    setError(null);
    setAppState('landing');
  };
  
  const handleShowTerms = () => {
    if (appState !== 'terms' && appState !== 'privacy') {
      setPreviousAppState(appState);
    }
    setAppState('terms');
  };

  const handleShowPrivacy = () => {
    if (appState !== 'terms' && appState !== 'privacy') {
      setPreviousAppState(appState);
    }
    setAppState('privacy');
  };
  
  const handleBackFromLegal = () => {
    setAppState(previousAppState);
  };


  const renderContent = () => {
    switch (appState) {
      case 'landing':
        return <LandingScreen onStart={() => setAppState('upload')} onSelectExample={handleSelectExample} isLoading={isLoading} />;
      case 'upload':
        return <UploadScreen onFindSpot={handleFindSpot} onSelectExample={handleSelectExample} isLoading={isLoading} error={error} credits={credits} onBack={handleBackToHome} />;
      case 'processing':
        return <ProcessingScreen />;
      case 'results':
        if (imageSrc && analysisResult) {
          return <ResultsScreen imageSrc={imageSrc} analysisResult={analysisResult} onTryAnother={handleTryAnother} creditConsumed={creditConsumed} />;
        }
        // Fallback to upload if results are not available
        setAppState('upload');
        return null;
      case 'terms':
        return <TermsOfService onBack={handleBackFromLegal} />;
      case 'privacy':
        return <PrivacyPolicy onBack={handleBackFromLegal} />;
      default:
        return <LandingScreen onStart={() => setAppState('upload')} onSelectExample={handleSelectExample} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/40 to-gray-900 flex flex-col">
       <main className="flex-grow flex flex-col justify-center items-center">
         {renderContent()}
       </main>
      <Footer onShowTerms={handleShowTerms} onShowPrivacy={handleShowPrivacy} />
    </div>
  );
};

export default App;
