import React from 'react';
import { trackEvent } from '../services/analytics';

interface ExamplePhotosProps {
  onSelectExample: (imageUrl: string) => void;
  isLoading: boolean;
}

const examples = [
  {
    url: 'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'The Colosseum in Rome, Italy',
  },
  {
    url: 'https://images.pexels.com/photos/1544947/pexels-photo-1544947.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'The Eiffel Tower in Paris, France',
  },
  {
    url: 'https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'The Golden Gate Bridge in San Francisco, USA',
  },
   {
    url: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'The Sydney Opera House in Sydney, Australia',
  },
];

const ExamplePhotos: React.FC<ExamplePhotosProps> = ({ onSelectExample, isLoading }) => {
  const handleSelect = (url: string) => {
    if (!isLoading) {
      trackEvent('select_example', { image_url: url });
      onSelectExample(url);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 text-center">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">Or try one of these</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {examples.map((example) => (
          <div
            key={example.url}
            onClick={() => handleSelect(example.url)}
            className={`relative rounded-lg overflow-hidden shadow-lg group transform transition-transform duration-300 ${
              isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'
            }`}
            role="button"
            aria-label={`Analyze photo of ${example.alt}`}
            tabIndex={isLoading ? -1 : 0}
          >
            <img src={example.url} alt={example.alt} className="w-full h-32 object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
               <p className="text-white text-center text-sm font-bold p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">{example.alt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamplePhotos;