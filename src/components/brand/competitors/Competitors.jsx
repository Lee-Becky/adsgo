import React, { useState } from 'react';
import { ExternalLink, Plus } from 'lucide-react';
import { COMPETITORS_MOCK_DATA } from './mockData';
import SetupCompetitorModal from './SetupCompetitorModal';

const Competitors = () => {
  const [competitors, setCompetitors] = useState(COMPETITORS_MOCK_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCompetitor = (newCompetitor) => {
    setCompetitors([newCompetitor, ...competitors]);
  };

  const handleRemoveCompetitor = (id) => {
    setCompetitors(competitors.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header Section - Re-added for Add button */}
      <div className="sticky top-0 z-10 py-3 px-10 pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex justify-end">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="pointer-events-auto bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Competitor
          </button>
        </div>
      </div>

      <main className="flex-1 p-10">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col gap-6">
            {competitors.map((competitor) => (
              <div 
                key={competitor.id}
                className="group relative bg-white border border-slate-100 rounded-[24px] p-8 transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 flex items-start gap-8"
              >
                <div className="w-24 h-24 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 p-1 overflow-hidden shadow-inner flex items-center justify-center">
                  <img 
                    src={competitor.logo} 
                    alt={competitor.name} 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {competitor.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <a 
                        href={competitor.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
                      >
                        <span className="hidden sm:inline">Visit Site</span>
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {competitor.description}
                  </p>

                  <div className="pt-4 flex items-center justify-end">
                    <button 
                      onClick={() => handleRemoveCompetitor(competitor.id)}
                      className="text-[13px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SetupCompetitorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCompetitor}
      />
    </div>
  );
};

export default Competitors;
