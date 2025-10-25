import React from 'react';
import { GlobeIcon } from './icons';
import ExamplePhotos from './ExamplePhotos';
import { trackEvent } from '../services/analytics';

interface LandingScreenProps {
  onStart: () => void;
  onSelectExample: (imageUrl: string) => void;
  isLoading: boolean;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart, onSelectExample, isLoading }) => {
  const handleStart = () => {
    trackEvent('start_app');
    onStart();
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white p-4">
      <h1 className="text-5xl md:text-7xl font-bold mb-4 flex items-center">
        Find where any photo was taken <span className="ml-4 text-blue-400"><GlobeIcon className="w-12 h-12 md:w-16 md:h-16 animate-pulse" /></span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
        Upload a photo to find the exact spot where your friends or favorite creators took theirs.
        <br />
        Get the Google Maps link and go capture it yourself.
      </p>
      <button
        onClick={handleStart}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 shadow-lg shadow-blue-500/50 disabled:shadow-none"
      >
        Try It Now
      </button>
      <ExamplePhotos onSelectExample={onSelectExample} isLoading={isLoading} />
    </div>
  );
};

export default LandingScreen;