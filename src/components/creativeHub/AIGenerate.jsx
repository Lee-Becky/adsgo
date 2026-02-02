import React from 'react';

const AIGenerate = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700">
        AI生成创意，平移 adsgo现有的生成创意能力，可访问{" "}
        <a 
          href="https://www.adsgo.ai/app/creative-generate" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-bold underline hover:text-blue-800 transition-colors"
        >
          https://www.adsgo.ai/app/creative-generate
        </a>{" "}
        体验
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
