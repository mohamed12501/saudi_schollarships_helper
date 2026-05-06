import React from 'react';
import { usePrograms } from '../hooks/usePrograms';
import ProgramCard from '../components/ProgramCard';
import FilterSection from '../components/FilterSection';
import { Loader2, SearchX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { 
    programs, 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    filters, 
    excludeKeys,
    toggleExclude,
    updateFilter, 
    resetFilters, 
    filterOptions 
  } = usePrograms();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 max-w-md">
          <h2 className="text-lg font-bold mb-1">Oops! Something went wrong</h2>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
        >
          Find Your Future in <span className="text-primary-600">Saudi Arabia</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600 max-w-2xl mx-auto"
        >
          Discover thousands of academic programs, scholarships, and opportunities across the Kingdom's top universities.
        </motion.p>
      </div>

      {/* Search & Filters */}
      <div className="mb-12">
        <FilterSection 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          excludeKeys={excludeKeys}
          toggleExclude={toggleExclude}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          filterOptions={filterOptions}
        />
      </div>

      {/* Programs List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="text-primary-600 animate-spin" size={48} />
          <p className="text-slate-500 font-medium">Parsing programs data...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              {programs.length} {programs.length === 1 ? 'Program' : 'Programs'} Found
            </h2>
            <div className="text-sm text-slate-500">
              Showing results based on your criteria
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {programs.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {programs.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 px-6 text-center"
              >
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchX className="text-slate-300" size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No programs match your search</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <button 
                  onClick={resetFilters}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-200"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Home;
