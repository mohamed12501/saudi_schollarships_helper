import React, { useState } from 'react';
import { Search, Filter, X, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';

const MultiSelect = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { include = [], exclude = [] } = selected || {};



  // Helper to determine if we should show the summary
  const totalCount = include.length + exclude.length;

  return (
    <div className="space-y-1 relative">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-0.5">
        {label}
      </label>
      <div 
        className={`w-full border rounded-lg px-2.5 py-1.5 text-xs cursor-pointer flex justify-between items-center min-h-[34px] transition-all bg-slate-50 border-slate-200 hover:bg-white`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`truncate pr-4 ${totalCount > 0 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
          {totalCount === 0 
            ? `All ${label}s` 
            : `${include.length > 0 ? '+' + include.length : ''} ${exclude.length > 0 ? '-' + exclude.length : ''}`.trim()}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-1 animate-in fade-in zoom-in duration-150">
            {options.length > 0 ? options.map((option) => {
              const isIncluded = include.includes(option);
              const isExcluded = exclude.includes(option);

              return (
                <div 
                  key={option}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg group transition-colors"
                >
                  <span className={`text-[11px] truncate flex-grow ${isIncluded ? 'text-green-600 font-bold' : isExcluded ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                    {option}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); onChange('include', option); }}
                      className={`p-1 rounded transition-colors ${isIncluded ? 'bg-green-100 text-green-600' : 'text-slate-300 hover:text-green-500 hover:bg-green-50'}`}
                      title="Include"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onChange('exclude', option); }}
                      className={`p-1 rounded transition-colors ${isExcluded ? 'bg-red-100 text-red-600' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                      title="Exclude"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              );
            }) : (
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
            <span>Advanced Filters</span>
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
                onChange={(type, val) => updateFilter(key, type, val)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
