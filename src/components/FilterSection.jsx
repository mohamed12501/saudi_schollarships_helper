import React, { useState } from 'react';
import { Search, Filter, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MultiSelect = ({ label, options, selected, onChange, isExclude, onToggleExclude }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="space-y-1 relative">
      <div className="flex items-center justify-between ml-0.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleExclude();
          }}
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors ${
            isExclude 
              ? 'bg-red-100 text-red-600' 
              : 'bg-slate-100 text-slate-400 hover:text-slate-600'
          }`}
          title={isExclude ? "Excluding selected" : "Including selected"}
        >
          {isExclude ? 'EXCLUDE' : 'INCLUDE'}
        </button>
      </div>
      <div 
        className={`w-full border rounded-lg px-2.5 py-1.5 text-xs cursor-pointer flex justify-between items-center min-h-[34px] transition-all ${
          isExclude 
            ? 'bg-red-50/30 border-red-200 hover:bg-red-50/50' 
            : 'bg-slate-50 border-slate-200 hover:bg-white'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`truncate pr-4 ${selected.length > 0 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
          {selected.length === 0 ? `Select ${label}` : `${isExclude ? 'Not: ' : ''}${selected.length} selected`}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto p-1 animate-in fade-in zoom-in duration-150">
            {options.length > 0 ? options.map((option) => (
              <div 
                key={option}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => toggleOption(option)}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                  selected.includes(option) 
                    ? (isExclude ? 'bg-red-500 border-red-500' : 'bg-primary-600 border-primary-600') 
                    : 'border-slate-300'
                }`}>
                  {selected.includes(option) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className={`text-[11px] truncate ${selected.includes(option) ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                  {option}
                </span>
              </div>
            )) : (
              <div className="px-3 py-2 text-xs text-slate-400 italic">No options available</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const FilterSection = ({ 
  searchQuery, 
  setSearchQuery, 
  filters, 
  excludeKeys,
  toggleExclude,
  updateFilter, 
  resetFilters, 
  filterOptions 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by name, university, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
        />
      </div>

      {/* Filters Grid */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm sm:text-base">
            <Filter size={16} className="text-primary-600" />
            <span>Filters</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={resetFilters}
              className="text-[10px] sm:text-xs font-semibold text-slate-400 hover:text-primary-600 flex items-center gap-1 transition-colors uppercase tracking-wider"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Reset All</span>
              <span className="sm:hidden">Reset</span>
            </button>
            
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="sm:hidden p-1.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        <div className={`${isOpen ? 'block' : 'hidden'} sm:block mt-4 pt-4 border-t border-slate-50`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-9 gap-3 sm:gap-4">
            {Object.entries(filterOptions).map(([key, options]) => (
              <MultiSelect
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').trim()}
                options={options}
                selected={filters[key]}
                onChange={(val) => updateFilter(key, val)}
                isExclude={excludeKeys.has(key)}
                onToggleExclude={() => toggleExclude(key)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
