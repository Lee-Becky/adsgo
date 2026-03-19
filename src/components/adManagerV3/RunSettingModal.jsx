import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Clock, ChevronDown, Plus } from 'lucide-react';
import { createPortal } from 'react-dom';

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

const MAX_TIME_SLOTS = 6;

const RunSettingModal = ({ isOpen, onClose, onSave }) => {
  const [frequency, setFrequency] = useState('daily');
  const [timeSlots, setTimeSlots] = useState(['11:00 PM – 12:00 AM']);
  const [selectedTime, setSelectedTime] = useState('');
  const [customDays, setCustomDays] = useState(3);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [timeError, setTimeError] = useState(false);

  const timeDropdownRef = useRef(null);

  useEffect(() => {
    if (!showTimeDropdown) return;
    const handleClickOutside = (e) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target)) {
        setShowTimeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTimeDropdown]);

  if (!isOpen) return null;

  const handleSave = () => {
    let finalSlots = frequency === 'daily' ? [...timeSlots] : [selectedTime || timeSlots[0] || TIME_SLOTS[0]];
    if (frequency === 'daily' && selectedTime && !timeSlots.includes(selectedTime) && timeSlots.length < MAX_TIME_SLOTS) {
      finalSlots = [...timeSlots, selectedTime];
      setTimeSlots(finalSlots);
      setSelectedTime('');
    }
    onSave?.({
      frequency,
      customDays: frequency === 'custom' ? customDays : null,
      timeSlots: finalSlots,
    });
    onClose();
  };

  const handleAddTime = () => {
    if (!selectedTime) {
      setTimeError(true);
      return;
    }
    setTimeError(false);
    if (timeSlots.length >= MAX_TIME_SLOTS || timeSlots.includes(selectedTime)) return;
    setTimeSlots(prev => [...prev, selectedTime]);
    setSelectedTime('');
  };

  const handleRemoveTime = (slot) => {
    if (timeSlots.length <= 1) return;
    setTimeSlots(prev => prev.filter(s => s !== slot));
  };

  const frequencies = [
    { key: 'daily', label: 'Daily' },
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
          {/* Frequency Selector */}
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
                    onChange={() => setFrequency(key)}
                    className="w-4 h-4 border-2 border-gray-200 text-[#7033F5] accent-[#7033F5] focus:ring-0 transition-all duration-200 cursor-pointer"
                  />
                  <span className={`text-sm transition-all duration-200 ${frequency === key ? 'font-semibold text-[#7033F5]' : 'font-medium text-gray-500'}`}>{label}</span>
                </label>
              ))}
            </div>
          </div>

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

          {/* Execution Time */}
          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
            <label className="text-xs font-semibold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#7033F5] shrink-0"></span>
              Execution Time
            </label>
            <div className="pl-3 space-y-2.5">
              {/* Time chips - only in daily mode when multiple times */}
              {frequency === 'daily' && timeSlots.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      className="flex items-center justify-between bg-[#f3f0ff] border border-[#e5dbff] rounded-lg px-3 py-2 group transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-[#7033F5]" />
                        <span className="text-sm font-medium text-[#7033F5]">{slot}</span>
                      </div>
                      {timeSlots.length > 1 && (
                        <button
                          onClick={() => handleRemoveTime(slot)}
                          className="p-0.5 rounded-md text-[#7033F5]/40 hover:text-[#7033F5] hover:bg-[#e5dbff] transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Time dropdown + Add button */}
              {frequency !== 'daily' || timeSlots.length < MAX_TIME_SLOTS ? (<div className="flex items-center gap-2">
                <div className="relative flex-1" ref={timeDropdownRef}>
                  <button
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm text-gray-700 bg-white transition-all duration-200 ${
                      timeError
                        ? 'border-red-500 shadow-[0_4px_14px_0_rgba(239,68,68,0.15)]'
                        : showTimeDropdown
                          ? 'border-[#7033F5] shadow-[0_4px_14px_0_rgba(112,51,245,0.2)]'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className={`font-medium ${selectedTime ? '' : 'text-gray-400'}`}>
                        {selectedTime || 'Select execution time'}
                      </span>
                    </div>
                    {selectedTime ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedTime(''); setTimeError(false); }}
                        className="p-0.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    ) : (
                      <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showTimeDropdown ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {showTimeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                      {TIME_SLOTS.map(slot => {
                        const isAdded = frequency === 'daily' && timeSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            disabled={isAdded}
                            onClick={() => { if (!isAdded) { setSelectedTime(slot); setShowTimeDropdown(false); setTimeError(false); } }}
                            className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors duration-150 ${
                              isAdded
                                ? 'text-gray-300 cursor-not-allowed'
                                : selectedTime === slot
                                  ? 'bg-[#f3f0ff] text-[#7033F5] font-semibold'
                                  : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span>{slot}</span>
                            {isAdded && <span className="text-[10px] font-semibold text-gray-300">Added</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Add Time button - daily mode only */}
                {frequency === 'daily' && (
                  <button
                    onClick={handleAddTime}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 border border-[#7033F5] text-[#7033F5] hover:bg-[#f3f0ff]"
                  >
                    <Plus size={14} />
                    <span>Add Time</span>
                  </button>
                )}
              </div>
              ) : (
                <span className="text-xs text-gray-400">Maximum 6 execution times reached</span>
              )}

              <span className="text-[11px] font-medium text-gray-400 block">(UTC+08:00) Brand Time Zone</span>
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
