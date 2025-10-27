import React from 'react';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 text-white">
      <div className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
        <div className="prose-sm sm:prose-base prose-invert max-w-none text-gray-300 space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          <p>Last Updated: July 2024</p>
          
          <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p>By accessing or using Photospot ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, do not use the Service.</p>

          <h2 className="text-xl font-semibold text-white">2. Description of Service</h2>
          <p>The Service uses artificial intelligence to analyze photographs you upload and provide an estimated geographical location where the photo was taken. The Service is intended for entertainment, creative, and travel-planning purposes.</p>

          <h2 className="text-xl font-semibold text-white">3. User Conduct and Restrictions</h2>
          <p>You agree not to use the Service for any unlawful purpose or in any way that could harm the Service or its users. Specifically, you agree that you will not:</p>
          <ul className="list-disc list-inside">
            <li>Upload any content that is illegal, harmful, threatening, abusive, or otherwise objectionable.</li>
            <li>Upload images for which you do not have the necessary rights or permissions.</li>
            <li><strong>Attempt to use the Service to stalk, harass, or spy on any individual, or to determine an individual's location in real-time without their explicit consent.</strong> The intended purpose of this application is to discover the locations of interesting photos so that you may visit them yourself for photography or tourism, not to track people.</li>
            <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">4. Credits and Payments</h2>
          <p>Certain features of the Service require the use of "credits," which can be purchased. All purchases are final and non-refundable. We reserve the right to change the pricing for credits at any time.</p>

          <h2 className="text-xl font-semibold text-white">5. Disclaimer of Warranties</h2>
          <p>The Service is provided on an "as is" and "as available" basis. We make no warranty that the location analysis will be accurate, reliable, or error-free. You use the Service at your own risk.</p>

          <h2 className="text-xl font-semibold text-white">6. Limitation of Liability</h2>
          <p>In no event shall Photospot or its developers be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Service.</p>

          <h2 className="text-xl font-semibold text-white">7. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Service after any such change constitutes your acceptance of the new Terms.</p>
        </div>
        <div className="mt-8 text-center">
            <button
                onClick={onBack}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-full text-lg transition-all transform hover:scale-105 duration-300"
            >
                Back to App
            </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
