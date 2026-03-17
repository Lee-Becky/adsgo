import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Clock, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';

const WEEK_DAYS = [
  { key: 0, label: 'Mon', full: 'Monday' },
  { key: 1, label: 'Tue', full: 'Tuesday' },
  { key: 2, label: 'Wed', full: 'Wednesday' },
  { key: 3, label: 'Thu', full: 'Thursday' },
  { key: 4, label: 'Fri', full: 'Friday' },
  { key: 5, label: 'Sat', full: 'Saturday' },
  { key: 6, label: 'Sun', full: 'Sunday' },
];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const startHour = i;
  const endHour = (i + 1) % 24;
  const fmt = (h) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:00 ${period}`;
  };
  return `${fmt(startHour)} – ${fmt(endHour)}`;
});

const RunSettingModal = ({ isOpen, onClose, onSave }) => {
  const [frequency, setFrequency] = useState('daily');
  const [weekDays, setWeekDays] = useState([]);
  const [monthDays, setMonthDays] = useState([]);
  const [timeSlot, setTimeSlot] = useState('12:00 PM – 1:00 PM');
  const [customDays, setCustomDays] = useState(3);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showWeekDropdown, setShowWeekDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const weekDropdownRef = useRef(null);
  const monthDropdownRef = useRef(null);
  const timeDropdownRef = useRef(null);

  const closeAllDropdowns = () => {
    setShowTimeDropdown(false);
    setShowWeekDropdown(false);
    setShowMonthDropdown(false);
  };

  // Click outside to close dropdowns
  useEffect(() => {
    if (!showWeekDropdown && !showMonthDropdown && !showTimeDropdown) return;

    const handleClickOutside = (e) => {
      if (
        showWeekDropdown && weekDropdownRef.current && !weekDropdownRef.current.contains(e.target)
      ) setShowWeekDropdown(false);
      if (
        showMonthDropdown && monthDropdownRef.current && !monthDropdownRef.current.contains(e.target)
      ) setShowMonthDropdown(false);
      if (
        showTimeDropdown && timeDropdownRef.current && !timeDropdownRef.current.contains(e.target)
      ) setShowTimeDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWeekDropdown, showMonthDropdown, showTimeDropdown]);

  if (!isOpen) return null;

  const handleFrequencyChange = (newFreq) => {
    setFrequency(newFreq);
    if (newFreq === 'weekly') {
      setMonthDays([]);
    } else if (newFreq === 'monthly') {
      setWeekDays([]);
    } else {
      setWeekDays([]);
      setMonthDays([]);
    }
  };

  const toggleWeekDay = (dayKey) => {
    setWeekDays(prev =>
      prev.includes(dayKey) ? prev.filter(d => d !== dayKey) : [...prev, dayKey].sort()
    );
  };

  const toggleMonthDay = (day) => {
    setMonthDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleSave = () => {
    onSave?.({
      frequency,
      weekDays: frequency === 'weekly' ? weekDays : [],
      monthDays: frequency === 'monthly' ? monthDays : [],
      customDays: frequency === 'custom' ? customDays : null,
      timeSlot,
    });
    onClose();
  };

  const frequencies = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'custom', label: 'Custom' },
  ];

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#7033F5] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/50">
              <Settings size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 leading-none mb-1">Run Setting</h2>
              <p className="text-[11px] font-medium text-gray-400">Set when and how often the brand is provided budget optimization.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Frequency Selector - Radio Group */}
          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
            <label className="text-xs font-semibold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#7033F5] shrink-0"></span>
              Frequency
            </label>
            <div className="flex items-center gap-5 pl-3">
              {frequencies.map(({ key, label }) => (
                <label key={key} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="frequency"
                    checked={frequency === key}
                    onChange={() => handleFrequencyChange(key)}
                    className="w-4 h-4 border-2 border-gray-200 text-[#7033F5] accent-[#7033F5] focus:ring-0 transition-all duration-200 cursor-pointer"
                  />
                  <span className={`text-sm transition-all duration-200 ${frequency === key ? 'font-semibold text-[#7033F5]' : 'font-medium text-gray-500'}`}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Weekly: Days of Week Dropdown */}
          {frequency === 'weekly' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 bg-gray-50/80 border border-gray-100 rounded-xl p-4">
              <label className="text-xs font-semibold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#7033F5] shrink-0"></span>
                Days of Week
              </label>
              <div className="relative" ref={weekDropdownRef}>
                <button
                  onClick={() => {
                    setShowWeekDropdown(!showWeekDropdown);
                    setShowMonthDropdown(false);
                    setShowTimeDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm bg-white transition-all duration-200 ${
                    showWeekDropdown
                      ? 'border-[#7033F5] shadow-[0_4px_14px_0_rgba(112,51,245,0.2)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`font-medium ${weekDays.length > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                    {weekDays.length > 0
                      ? weekDays.map(k => WEEK_DAYS.find(d => d.key === k)?.full).join(', ')
                      : 'Select days'}
                  </span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showWeekDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showWeekDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                    {WEEK_DAYS.map(({ key, full }) => (
                      <button
                        key={key}
                        onClick={() => toggleWeekDay(key)}
                        className={`w-full px-3 py-2.5 flex items-center gap-3 text-left text-sm transition-colors duration-150 ${
                          weekDays.includes(key)
                            ? 'bg-[#f3f0ff] text-[#7033F5]'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          weekDays.includes(key)
                            ? 'bg-[#7033F5] border-[#7033F5]'
                            : 'border-gray-300'
                        }`}>
                          {weekDays.includes(key) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className="font-medium">{full}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Monthly: Days of Month Dropdown with Calendar Grid */}
          {frequency === 'monthly' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 bg-gray-50/80 border border-gray-100 rounded-xl p-4">
              <label className="text-xs font-semibold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#7033F5] shrink-0"></span>
                Days of Month
              </label>
              <div className="relative" ref={monthDropdownRef}>
                <button
                  onClick={() => {
                    setShowMonthDropdown(!showMonthDropdown);
                    setShowWeekDropdown(false);
                    setShowTimeDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm bg-white transition-all duration-200 ${
                    showMonthDropdown
                      ? 'border-[#7033F5] shadow-[0_4px_14px_0_rgba(112,51,245,0.2)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`font-medium ${monthDays.length > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                    {monthDays.length > 0 ? monthDays.join(', ') : 'Select days'}
                  </span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showMonthDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showMonthDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-3">
                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <button
                          key={day}
                          onClick={() => toggleMonthDay(day)}
                          className={`w-full aspect-square flex items-center justify-center text-xs font-semibold rounded-lg border transition-all duration-200 ${
                            monthDays.includes(day)
                              ? 'bg-[#7033F5] text-white border-[#7033F5] shadow-sm'
                              : 'border-gray-100 text-gray-600 hover:border-[#b197fc] hover:text-[#7033F5] hover:bg-[#f3f0ff]'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom: Every X days */}
          {frequency === 'custom' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 bg-gray-50/80 border border-gray-100 rounded-xl p-4">
              <label className="text-xs font-semibold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#7033F5] shrink-0"></span>
                Interval
              </label>
              <div className="flex items-center gap-2.5 pl-3">
                <span className="text-sm text-gray-600">Every</span>
                <input
                  type="number"
                  min={2}
                  max={365}
                  value={customDays}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1 && val <= 365) setCustomDays(val);
                    else if (e.target.value === '') setCustomDays('');
                  }}
                  onBlur={() => {
                    if (!customDays || customDays < 2) setCustomDays(2);
                  }}
                  className="w-16 text-center px-2 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-[#7033F5] focus:shadow-[0_4px_14px_0_rgba(112,51,245,0.2)] transition-all duration-200"
                />
                <span className="text-sm text-gray-600">days</span>
              </div>
            </div>
          )}

          {/* Time Selector */}
          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
            <label className="text-xs font-semibold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#7033F5] shrink-0"></span>
              Time
            </label>
            <div className="pl-3">
              <div className="relative" ref={timeDropdownRef}>
                <button
                  onClick={() => {
                    setShowTimeDropdown(!showTimeDropdown);
                    setShowWeekDropdown(false);
                    setShowMonthDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm text-gray-700 bg-white transition-all duration-200 ${
                    showTimeDropdown
                      ? 'border-[#7033F5] shadow-[0_4px_14px_0_rgba(112,51,245,0.2)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="font-medium">{timeSlot}</span>
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showTimeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTimeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        onClick={() => {
                          setTimeSlot(slot);
                          setShowTimeDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 ${
                          timeSlot === slot
                            ? 'bg-[#f3f0ff] text-[#7033F5] font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[11px] font-medium text-gray-400 mt-2 block">(UTC+08:00) Brand Time Zone</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#7033F5] hover:bg-[#6741d9] active:bg-[#5f3dc4] rounded-lg transition-all duration-200 shadow-sm hover:shadow-[0_4px_14px_0_rgba(112,51,245,0.2)]"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RunSettingModal;
