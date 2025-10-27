import React, { useState } from 'react';
import { UploadIcon, CreditIcon, ArrowLeftIcon } from './icons';
import ExamplePhotos from './ExamplePhotos';
import { trackEvent } from '../services/analytics';

interface UploadScreenProps {
  onFindSpot: (base64Image: string, mimeType: string, displaySrc: string) => void;
  onSelectExample: (imageUrl: string) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
  credits: number;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFindSpot, onSelectExample, isLoading, error, credits, onBack }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ base64: string; mimeType: string; } | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setInternalError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const displaySrc = reader.result as string;
        setImagePreview(displaySrc);
        const base64 = displaySrc.split(',')[1];
        setFileData({ base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    } else {
      setInternalError('Please select a valid image file.');
      setImagePreview(null);
      setFileData(null);
    }
  };
  
  const handleFindClick = async () => {
    setInternalError(null);
    if (credits <= 0) {
        setInternalError("You have no credits left. Please purchase a pack to continue.");
        return;
    }
    if (fileData && imagePreview) {
      trackEvent('upload_photo');
      onFindSpot(fileData.base64, fileData.mimeType, imagePreview);
    } else {
      setInternalError('Please upload an image.');
    }
  };

  const handlePurchaseClick = (credits: number, value: number) => {
    trackEvent('begin_checkout', {
      value: value,
      currency: 'USD',
      items: [{
        item_id: `credits_${credits}`,
        item_name: `${credits} Credits Pack`,
        price: value,
        quantity: 1
      }]
    });
  };

  const isButtonDisabled = isLoading || !fileData;

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button 
                onClick={onBack} 
                className="text-gray-400 hover:text-white transition-colors mr-3 p-2 -ml-2 rounded-full" 
                aria-label="Go back to home page"
              >
                  <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold text-white">Upload a Photo</h2>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-500 text-white py-2 px-4 rounded-full shadow-lg">
                <CreditIcon className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold">{credits}</span>
                <span className="text-sm text-gray-300">Credits</span>
            </div>
        </div>
        
        { (error || internalError) && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error || internalError}</span>
            </div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300">Upload from your device</label>
            <p className="text-xs text-gray-400 mt-1 mb-2">Each photo analysis costs 1 credit. Example photos are always free.</p>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/80 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP</p>
                </div>
                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        </div>

        {imagePreview && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
            <img src={imagePreview} alt="Preview" className="max-h-48 w-auto mx-auto rounded-lg shadow-lg"/>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleFindClick}
            disabled={isButtonDisabled}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-12 rounded-full text-lg transition-all transform hover:scale-105 duration-300 shadow-lg shadow-blue-500/50 disabled:shadow-none"
          >
            Find This Spot
          </button>
        </div>
      </div>
       <div className="w-full max-w-2xl mt-8">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-white">Need more credits?</h3>
          <p className="text-gray-400 text-sm">Purchase a credit pack to continue analyzing photos.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer"
                onClick={() => handlePurchaseClick(5, 4.95)}
            >
                <h4 className="text-xl font-bold text-white">5 Credits Pack</h4>
                <p className="text-3xl font-extrabold text-blue-400 my-2">$4.95</p>
                <p className="text-gray-400 text-sm mb-4">(~$0.99 per photo)</p>
                <stripe-buy-button
                    buy-button-id="buy_btn_1SLjs6Ec5TiCCOoXoaOsuE6i"
                    publishable-key="pk_test_51SLPfeEc5TiCCOoXboZDmoLScaOHaauz0LrnGWSZl5gGOtR0fCaFDafNo9o4tCZPx5KiPqw0q6MMfJrXsXlwOwt5005KzGTRAC"
                >
                </stripe-buy-button>
            </div>
            <div
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer"
                onClick={() => handlePurchaseClick(12, 9.99)}
            >
                <h4 className="text-xl font-bold text-white">12 Credits Pack</h4>
                <p className="text-3xl font-extrabold text-blue-400 my-2">$9.99</p>
                <p className="text-gray-400 text-sm mb-4">(~$0.83 per photo)</p>
                 <stripe-buy-button
                    buy-button-id="buy_btn_1SLjufEc5TiCCOoXGso4WpMb"
                    publishable-key="pk_test_51SLPfeEc5TiCCOoXboZDmoLScaOHaauz0LrnGWSZl5gGOtR0fCaFDafNo9o4tCZPx5KiPqw0q6MMfJrXsXlwOwt5005KzGTRAC"
                >
                </stripe-buy-button>
            </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
            Note: To receive credits, you must configure your Stripe Buy Button's "Confirmation Page" to redirect to this app's URL with query parameters: `?purchase=success&credits=5` (or `&credits=12`).
        </p>
      </div>
      <ExamplePhotos onSelectExample={onSelectExample} isLoading={isLoading} />
    </div>
  );
};

export default UploadScreen;