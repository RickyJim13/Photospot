
import React from 'react';

const ProcessingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white p-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-400 mb-6"></div>
      <h2 className="text-3xl md:text-4xl font-bold mb-2">Analyzing photo...</h2>
      <p className="text-lg text-gray-300">Hang tight, our AI is on the case! 🌍</p>
    </div>
  );
};

export default ProcessingScreen;
