import React from 'react';

const AIGenerate = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Generate</h1>
        <p className="text-gray-500">Generate ad creatives using AI</p>
      </div>
      
      <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden flex items-center justify-center p-4">
        <img 
          src="/AIGC creative.png" 
          alt="AI Generated Creative" 
          className="max-w-full max-h-full object-contain shadow-md rounded-lg"
        />
      </div>
    </div>
  );
};

export default AIGenerate;
