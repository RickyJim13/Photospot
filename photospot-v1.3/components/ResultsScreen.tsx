

import React from 'react';
import { LocationAnalysis } from '../types';
import { MapPinIcon } from './icons';
import { trackEvent } from '../services/analytics';

interface ResultsScreenProps {
  imageSrc: string;
  analysisResult: LocationAnalysis;
  onTryAnother: () => void;
  creditConsumed: boolean | null;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ imageSrc, analysisResult, onTryAnother, creditConsumed }) => {
  const { location_name, coordinates, confidence } = analysisResult;
  const mapsUrl = `https://maps.google.com/?q=${coordinates}`;
  const confidencePercentage = Math.round(confidence * 100);

  const handleOpenMaps = () => {
    trackEvent('open_maps', { location_name: location_name });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-64 w-full object-cover md:h-full md:w-64" src={imageSrc} alt="Analyzed photo" />
          </div>
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="uppercase tracking-wide text-sm text-blue-400 font-semibold">Detected Location</div>
              <p className="mt-2 text-3xl font-bold text-white flex items-center">
                <MapPinIcon className="w-8 h-8 mr-3 text-green-400" />
                {location_name}
              </p>
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-1">Confidence</p>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-teal-400 h-3 rounded-full transition-width duration-500"
                    style={{ width: `${confidencePercentage}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-300 mt-1">{confidencePercentage}%</p>
              </div>
              {creditConsumed === false && (
                <div className="mt-4 bg-green-900/50 border border-green-700 text-green-200 px-4 py-2 rounded-lg text-sm text-center">
                  <p><strong>Free Analysis!</strong> The confidence score was below 80%, so this one's on us.</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleOpenMaps}
                    className="w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform transform hover:scale-105 duration-300"
                >
                    Open in Google Maps
                </a>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                <button
                    onClick={onTryAnother}
                    className="flex-1 text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors duration-300"
                >
                    Try Another Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;