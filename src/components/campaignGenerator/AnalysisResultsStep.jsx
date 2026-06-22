import React, { useState } from 'react';
import { CheckCircle2, Users, Activity, ChevronDown, Sparkles, Search, DollarSign, Megaphone, MousePointer2, ShoppingBag, Smartphone, Check, ChevronLeft, ArrowRight, ChevronRight, X } from 'lucide-react';

const CustomDropdown = ({ label, options, value, onChange, placeholder, isSearchable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selectedOption = options.find(opt => opt.value === value || opt.label === value);

  const filteredOptions = isSearchable 
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div className="space-y-3 relative text-left">
      {label && <label className="text-sm font-bold text-neutral-900 ml-1">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-6 py-4 bg-neutral-50 border-2 rounded-2xl cursor-pointer transition-all ${
          isOpen ? 'border-primary-500 bg-white shadow-lg' : 'border-transparent hover:border-primary-100 hover:bg-white'
        }`}
      >
        <span className={`text-base font-bold truncate ${selectedOption ? 'text-neutral-700' : 'text-neutral-300'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={20} className={`text-neutral-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-500' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[120] mt-2 w-full left-0 bg-white border border-neutral-100 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
          {isSearchable && (
            <div className="p-2 mb-2 sticky top-0 bg-white z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                <input 
                  autoFocus
                  className="w-full pl-9 pr-4 py-2 bg-neutral-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                  (value === opt.value || value === opt.label) ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50 text-neutral-600'
                }`}
              >
                <span>{opt.label}</span>
                {(value === opt.value || value === opt.label) && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const AnalysisResultsStep = ({ onBack, onGenerate, LOGO_LINKS, initialUrl }) => {
  const [isObjectiveOpen, setIsObjectiveOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState('sales_conversions');
  
  const [isEventSelectOpen, setIsEventSelectOpen] = useState(false);
  const [selectorStage, setSelectorStage] = useState('goal'); // 'goal' or 'event'
  const [selectedAdsetGoal, setSelectedAdsetGoal] = useState('in_web_actions');
  const [selectedEvent, setSelectedEvent] = useState('Purchase');
  const [eventSearch, setEventSearch] = useState('');

  const campaignObjectives = [
    { value: 'awareness_engagement', label: 'Awareness & Engagement', icon: Megaphone },
    { value: 'traffic', label: 'Traffic', icon: MousePointer2 },
    { value: 'leads', label: 'Leads', icon: Users },
    { value: 'sales_conversions', label: 'Sales & Conversions', icon: ShoppingBag },
    { value: 'app_promotion', label: 'App Promotion', icon: Smartphone }
  ];

  const getAdsetGoals = (objective) => {
    const mapping = {
      awareness_engagement: [
        { value: 'impressions', label: 'Impressions' },
        { value: 'post_engagement', label: 'Post engagement' },
        { value: 'conversations', label: 'Conversations' }
      ],
      traffic: [
        { value: 'impressions', label: 'Impressions' },
        { value: 'link_clicks', label: 'Link clicks' },
        { value: 'page_views', label: 'Page views' }
      ],
      leads: [
        { value: 'leads_landing_page', label: 'Leads within landing-page', needsEvent: true },
        { value: 'instant_form_leads', label: 'Instant form leads' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'calls', label: 'Calls' }
      ],
      sales_conversions: [
        { value: 'in_web_actions', label: 'In-web actions', needsEvent: true }
      ],
      app_promotion: [
        { value: 'installs', label: 'Installs' },
        { value: 'in_app_actions', label: 'In-app actions', needsEvent: true }
      ]
    };
    return mapping[objective] || [];
  };

  const allEvents = [
    'Purchase', 'AddToCart', 'InitiateCheckout', 'Lead', 
    'CompleteRegistration', 'SubmitApplication', 'Contact', 
    'Search', 'ViewContent', 'Subscribe', 'CustomizeProduct',
    'Donate', 'FindLocation', 'Schedule', 'StartTrial'
  ];

  const filteredEvents = allEvents.filter(ev => ev.toLowerCase().includes(eventSearch.toLowerCase()));
  const currentObjective = campaignObjectives.find(o => o.value === selectedObjective);
  const adsetGoals = getAdsetGoals(selectedObjective);
  const currentGoal = adsetGoals.find(g => g.value === selectedAdsetGoal);

  const personas = [
    { title: 'Beach fashion enthusiasts', age: '18-35', gender: '15% male, 85% female', details: 'Style-conscious women who actively...', interests: 'Swimsuit (apparel), Bikini (apparel), Summer (time), Beaches (places), Resort...', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    { title: 'Luxury travelers', age: '25-50', gender: '40% male, 60% female', details: 'High-income individuals seeking premium...', interests: 'First class, luxury resort, boutique hotel, private jet, fine dining...', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
    { title: 'Outdoor adventurers', age: '20-40', gender: '60% male, 40% female', details: 'Active souls who spend weekends...', interests: 'Hiking, Camping gear, Patagonia, National parks, trail running...', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper' },
    { title: 'Sustainability advocates', age: '22-45', gender: '30% male, 70% female', details: 'Conscious consumers looking for eco...', interests: 'Eco-friendly, zero waste, recycling, organic cotton, veganism...', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    { title: 'Digital nomads', age: '24-38', gender: '50% male, 50% female', details: 'Remote workers traveling while they...', interests: 'Remote work, coworking, Bali, Airbnb, travel insurance, MacBook...', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lilith' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 overflow-y-auto animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12 pb-32 relative min-h-screen flex flex-col">
        <div className="flex items-center gap-3 bg-success-50 border border-success-100 p-4 rounded-2xl animate-in slide-in-from-top-4 duration-700">
          <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center text-white shrink-0"><CheckCircle2 className="w-6 h-6" /></div>
          <p className="text-success-800 font-medium text-sm md:text-base">🥳 All set! Your best ad strategy is ready. Review your goals below and start your campaign with one click!</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-neutral-900 flex items-center gap-2"><Users className="w-6 h-6 text-primary-600" />Audience personas</h3>
            <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-bold rounded-full tracking-wider">5 segments found</span>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {personas.map((persona, i) => (
              <div key={i} className="min-w-[320px] bg-white rounded-2xl p-6 border border-neutral-100 shadow-xl shadow-neutral-200/50 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group flex flex-col h-[360px]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary-50 rounded-bl-[4rem] -z-10 group-hover:bg-primary-100 transition-colors"></div>
                <h4 className="text-lg font-bold text-neutral-900 truncate mb-4 pr-8 text-left">{persona.title}</h4>
                <div className="space-y-2.5 mb-5 flex-none">
                  <div className="flex text-[11px] items-center whitespace-nowrap"><span className="text-neutral-400 w-12 text-left">Age:</span><span className="text-neutral-900 font-bold text-left">{persona.age}</span><span className="mx-2 text-neutral-200">|</span><span className="text-neutral-400 w-14 text-left">Gender:</span><span className="text-neutral-900 font-bold truncate text-left">{persona.gender}</span></div>
                  <div className="flex text-xs h-8 overflow-hidden"><span className="text-neutral-400 w-12 shrink-0 text-left">Details:</span><span className="text-neutral-600 italic leading-tight line-clamp-2 text-left">{persona.details}</span></div>
                </div>
                <div className="h-[1px] bg-neutral-50 w-full mb-5 flex-none"></div>
                <div className="flex gap-3 h-24 overflow-hidden flex-1">
                  <div className="w-20 h-20 rounded-2xl bg-neutral-50 overflow-hidden shrink-0 border border-neutral-100"><img src={persona.img} alt="" className="w-full h-full object-cover" /></div>
                  <div className="space-y-1.5 flex-1 overflow-hidden text-left">
                    <span className="text-[9px] font-bold text-primary-400 tracking-wider block text-left">Interests</span>
                    <p className="text-[11px] text-neutral-500 leading-snug font-medium line-clamp-3 text-left">{persona.interests}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-2xl shadow-primary-100/50 overflow-hidden animate-in slide-in-from-bottom-8 duration-1000">
          <div className="p-8 border-b border-neutral-50 flex items-center gap-4 bg-neutral-50/50">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-neutral-100 text-left"><Activity className="w-6 h-6" /></div>
            <div className="text-left"><h3 className="text-xl font-bold text-neutral-900 text-left">Promotion objective</h3><p className="text-sm text-neutral-400 text-left">Configure your final campaign settings</p></div>
          </div>
          <div className="p-10 space-y-10">
            {/* Top Row: Business Type, Objective, Conversion Event */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left border-b border-neutral-50 pb-10">
              {/* Business Type - Smaller width (3 columns) */}
              <div className="md:col-span-3">
                <CustomDropdown 
                  label="Business type"
                  value="Online shopping"
                  onChange={() => {}}
                  options={[
                    { value: 'Online shopping', label: 'Online shopping' },
                    { value: 'Local Store & Service', label: 'Local Store & Service' },
                    { value: 'Solution & Online Service', label: 'Solution & Online Service' },
                    { value: 'App', label: 'App' }
                  ]}
                />
              </div>

              {/* Objective & Conversion Event Grid - Larger width (9 columns) */}
              <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Objective Selector */}
                <div className="space-y-3 text-left">
                  <label className="text-sm font-bold text-neutral-900 ml-1">Objective</label>
                  <div className="relative">
                    <div 
                      onClick={() => setIsObjectiveOpen(!isObjectiveOpen)}
                      className={`w-full flex items-center justify-between px-6 py-4 bg-neutral-50 border-2 rounded-2xl cursor-pointer transition-all ${
                        isObjectiveOpen ? 'border-primary-500 bg-white shadow-lg' : 'border-transparent hover:border-primary-100 hover:bg-white'
                      }`}
                    >
                      <span className="text-base font-bold text-neutral-700 truncate">{currentObjective?.label}</span>
                      <ChevronDown className={`w-5 h-5 text-neutral-300 transition-transform duration-300 ${isObjectiveOpen ? 'rotate-180 text-primary-500' : ''}`} />
                    </div>

                    {isObjectiveOpen && (
                      <div className="absolute z-[110] mt-2 w-full left-0 bg-white border border-neutral-100 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                        {campaignObjectives.map((obj) => (
                          <button
                            key={obj.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedObjective(obj.value);
                              setSelectedAdsetGoal('');
                              setSelectedEvent('');
                              setIsObjectiveOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                              selectedObjective === obj.value ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50 text-neutral-600'
                            }`}
                          >
                            <span>{obj.label}</span>
                            {selectedObjective === obj.value && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Conversion Event Selector */}
                <div className="space-y-3 text-left">
                  <label className="text-sm font-bold text-neutral-900 ml-1">Conversion Event</label>
                  <div className="relative">
                    <div 
                      onClick={() => {
                        setIsEventSelectOpen(!isEventSelectOpen);
                        setSelectorStage('goal');
                      }}
                      className={`w-full flex items-center justify-between px-6 py-4 bg-neutral-50 border-2 rounded-2xl cursor-pointer transition-all h-16 ${
                        (selectedAdsetGoal && (!currentGoal?.needsEvent || selectedEvent)) ? 'border-primary-500 bg-white shadow-lg' : 'border-transparent hover:border-primary-100 hover:bg-white'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        {selectedAdsetGoal && (!currentGoal?.needsEvent || selectedEvent) ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-neutral-400 truncate leading-none">{currentGoal?.label}</span>
                            {selectedEvent && (
                              <>
                                <ChevronRight size={14} className="text-neutral-300 shrink-0" />
                                <span className="text-base font-bold text-primary-600 truncate leading-none">{selectedEvent}</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-neutral-300">Select event...</span>
                        )}
                      </div>
                      <ChevronDown className={`w-5 h-5 text-neutral-300 transition-transform duration-300 ${isEventSelectOpen ? 'rotate-180 text-primary-500' : ''}`} />
                    </div>

                    {isEventSelectOpen && (
                      <div className="absolute z-[110] mt-2 w-72 right-0 bg-white border border-neutral-100 rounded-2xl shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-200">
                        {selectorStage === 'goal' ? (
                          <div className="space-y-2">
                            <p className="text-[9px] font-bold text-neutral-400 tracking-wider mb-1 px-1">Select Goal</p>
                            <div className="grid grid-cols-1 gap-1">
                              {adsetGoals.map(goal => (
                                <button
                                  key={goal.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedAdsetGoal(goal.value);
                                    setSelectedEvent('');
                                    if (goal.needsEvent) {
                                      setSelectorStage('event');
                                    } else {
                                      setIsEventSelectOpen(false);
                                    }
                                  }}
                                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${
                                    selectedAdsetGoal === goal.value ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50 text-neutral-600'
                                  }`}
                                >
                                  <span>{goal.label}</span>
                                  {goal.needsEvent ? <ArrowRight size={12} className="opacity-30 group-hover:opacity-100" /> : (selectedAdsetGoal === goal.value && <Check size={12} />)}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectorStage('goal');
                                }} 
                                className="p-1 hover:bg-neutral-100 rounded-md transition-colors text-neutral-400 hover:text-neutral-900"
                              >
                                <ChevronLeft size={14} />
                              </button>
                              <p className="text-[9px] font-bold text-neutral-400 tracking-wider">Back</p>
                            </div>
                            <div className="relative">
                              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
                              <input 
                                className="w-full pl-8 pr-3 py-2 bg-neutral-50 border-none rounded-lg text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-primary-500/20"
                                placeholder="Search events..."
                                value={eventSearch}
                                onChange={(e) => setEventSearch(e.target.value)}
                                autoFocus
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                              {filteredEvents.map(ev => (
                                <button
                                  key={ev}
                                  onClick={() => {
                                    setSelectedEvent(ev);
                                    setIsEventSelectOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${
                                    selectedEvent === ev ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'hover:bg-neutral-50 text-neutral-600'
                                  }`}
                                >
                                  {ev}
                                  {selectedEvent === ev && <Check size={12} />}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Ad platform, Target locations, Daily limit, Promotion type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 text-left">
              <div className="space-y-3 text-left">
                <label className="text-sm font-bold text-neutral-900 ml-1">Ad platform</label>
                <div className="relative flex items-center bg-neutral-50 rounded-2xl px-6 py-4 border border-transparent">
                  <div className="flex items-center gap-2 flex-1">
                    <img src={LOGO_LINKS.meta} className="w-6 h-6 rounded-md object-contain" alt="Meta" />
                    <span className="font-bold text-neutral-700">Meta</span>
                  </div>
                  <div className="flex items-center gap-2 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                    <Sparkles className="w-3 h-3 text-primary-600" />
                    <span className="text-[10px] font-bold text-primary-600 tracking-wider">Recommended</span>
                  </div>
                  <ChevronDown className="ml-4 w-5 h-5 text-neutral-300" />
                </div>
              </div>

              <div className="space-y-3 text-left">
                <label className="text-sm font-bold text-neutral-900 ml-1">Target locations</label>
                <div className="relative flex items-center bg-neutral-50 rounded-2xl px-6 py-4 border border-transparent">
                  <div className="flex flex-wrap gap-2 flex-1">
                    <span className="bg-white px-3 py-1 rounded-lg border border-neutral-100 text-sm font-bold text-neutral-700 flex items-center gap-2">
                      United States
                      <button className="text-neutral-300 hover:text-danger-500">×</button>
                    </span>
                  </div>
                  <Search className="ml-4 w-5 h-5 text-neutral-300" />
                </div>
              </div>

              <div className="space-y-3 text-left">
                <label className="text-sm font-bold text-neutral-900 ml-1">Suggested daily limit</label>
                <div className="relative flex items-center bg-neutral-50 rounded-2xl px-6 border border-transparent">
                  <input type="number" defaultValue="45" className="bg-transparent border-none py-4 px-0 w-full focus:ring-0 font-bold text-neutral-900 text-xl" />
                  <div className="h-6 w-[1px] bg-neutral-200 mx-4"></div>
                  <span className="font-bold text-neutral-400 tracking-wider">USD</span>
                </div>
              </div>

              <div>
                <CustomDropdown 
                  label="Promotion type"
                  value="Long-term"
                  onChange={() => {}}
                  options={[
                    { value: 'Long-term', label: 'Long-term' },
                    { value: 'Fixed term', label: 'Fixed term' },
                    { value: 'Dynamic', label: 'Dynamic' }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-[260px] right-0 h-24 bg-white/80 backdrop-blur-md border-t border-neutral-100 flex items-center justify-between px-12 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] text-left">
        <button onClick={onBack} className="px-10 py-3 bg-neutral-100 text-neutral-600 rounded-full text-xs font-bold tracking-wider hover:bg-neutral-200 transition-all border border-neutral-100 text-left">Previous</button>
        <button 
          onClick={() => onGenerate({
            objective: selectedObjective,
            adsetGoal: selectedAdsetGoal,
            event: selectedEvent,
            locations: ['United States'], // Dynamic based on UI in real logic
            dailyLimit: '45' // Dynamic based on UI in real logic
          })} 
          className="absolute left-1/2 -translate-x-1/2 px-20 py-4 bg-gradient-to-r from-primary-600 to-purple-800 text-white rounded-full text-sm font-bold tracking-wide shadow-2xl shadow-primary-200 hover:-translate-y-1 active:translate-y-0.5 transition-all text-left"
        >
          Generate campaign
        </button>
        <div className="w-[120px] text-left"></div>
      </div>
    </div>
  );
};
