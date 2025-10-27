import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 text-white">
      <div className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <div className="prose-sm sm:prose-base prose-invert max-w-none text-gray-300 space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          <p>Last Updated: July 2024</p>
          <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use Photospot ("the Service").</p>

          <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
          <ul className="list-disc list-inside">
            <li><strong>Images You Provide:</strong> When you upload an image, it is sent to a third-party AI service (Google Gemini API) for analysis. We do not store your images on our servers after the analysis is complete.</li>
            <li><strong>Usage Data:</strong> We use Google Analytics to collect anonymous data about how you interact with our Service. This includes events like page views, button clicks, and analysis outcomes (success/failure). This data helps us improve the app and is not personally identifiable.</li>
            <li><strong>Payment Information:</strong> Payments are processed by Stripe. We do not collect or store your credit card details.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">2. How We Use Information</h2>
          <ul className="list-disc list-inside">
            <li><strong>To Provide the Service:</strong> We use your uploaded images to perform the core function of the app—identifying the location where the photo was taken.</li>
            <li><strong>To Improve the Service:</strong> Anonymous usage data helps us understand user behavior, identify bugs, and enhance features.</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-white">3. Data Sharing</h2>
          <p>We do not sell or rent your personal information. We may share information with the following third parties:</p>
          <ul className="list-disc list-inside">
              <li><strong>Google (Gemini API):</strong> Your images are sent to Google's servers to be processed by their AI models. Your use of our Service is also subject to Google's Privacy Policy.</li>
              <li><strong>Stripe:</strong> For processing payments for credit packs.</li>
              <li><strong>Google Analytics:</strong> For collecting anonymous usage statistics.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">4. Data Security</h2>
          <p>We use standard security measures to protect the information transmitted to and from our Service. However, no method of transmission over the internet is 100% secure.</p>
          
          <h2 className="text-xl font-semibold text-white">5. User Responsibility</h2>
          <p>Please be mindful of the content you upload. Do not upload images that contain sensitive personal information or that could infringe on the privacy of others. This service is not intended for surveillance or tracking individuals.</p>

          <h2 className="text-xl font-semibold text-white">6. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
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

export default PrivacyPolicy;
