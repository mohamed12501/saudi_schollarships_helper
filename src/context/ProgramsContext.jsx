import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { parseExcelFile } from '../utils/excelParser';

const ProgramsContext = createContext();

export const ProgramsProvider = ({ children }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const initialFilterState = {
    degree: { include: [], exclude: [] },
    city: { include: [], exclude: [] },
    institution: { include: [], exclude: [] },
    language: { include: [], exclude: [] },
    gender: { include: [], exclude: [] },
    scholarship: { include: [], exclude: [] },
    studentType: { include: [], exclude: [] },
    requiredAttachments: { include: [], exclude: [] },
    conditions: { include: [], exclude: [] },
  };

  const [filters, setFilters] = useState(initialFilterState);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await parseExcelFile('/data.xlsx');
        setPrograms(data);
      } catch (err) {
        setError('Failed to load programs data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = Object.entries(filters).every(([key, { include, exclude }]) => {
        const hasIncludes = include.length > 0;
        const hasExcludes = exclude.length > 0;
        
        if (!hasIncludes && !hasExcludes) return true;

        const programValues = Array.isArray(program[key]) ? program[key] : [program[key]];
        const isEmpty = Array.isArray(program[key]) ? program[key].length === 0 : !program[key];

        if (hasExcludes) {
          const excludeNone = exclude.includes('None');
          if (excludeNone && isEmpty) return false;
          const normalExcludes = exclude.filter(v => v !== 'None');
          if (normalExcludes.some(val => programValues.includes(val))) return false;
        }

        if (hasIncludes) {
          const includeNone = include.includes('None');
          if (includeNone && isEmpty) return true;
          const normalIncludes = include.filter(v => v !== 'None');
          if (normalIncludes.some(val => programValues.includes(val))) return true;
          return false;
        }

        return true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [programs, searchQuery, filters]);

  const updateFilter = (key, type, value) => {
    setFilters((prev) => {
      const current = prev[key][type];
      const other = type === 'include' ? 'exclude' : 'include';
      const newCurrent = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      const newOther = prev[key][other].filter(v => v !== value);

      return {
        ...prev,
        [key]: {
          [type]: newCurrent,
          [other]: newOther
        }
      };
    });
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
    setSearchQuery('');
  };

  const filterOptions = useMemo(() => {
    const options = {
      degree: new Set(),
      city: new Set(),
      institution: new Set(),
      language: new Set(),
      gender: new Set(),
      scholarship: new Set(),
      studentType: new Set(),
      requiredAttachments: new Set(),
      conditions: new Set(),
    };

    programs.forEach((program) => {
      Object.keys(options).forEach((key) => {
        if (Array.isArray(program[key])) {
          program[key].forEach(item => {
            if (item && item.trim()) options[key].add(item.trim());
          });
        } else if (program[key]) {
          const val = String(program[key]).trim();
          if (val) options[key].add(val);
        }
      });
    });

    const result = Object.fromEntries(
      Object.entries(options).map(([key, value]) => [
        key,
        Array.from(value)
          .filter(v => v && v !== 'No' && v !== 'N/A' && v !== 'N / A' && v !== '[]' && v !== '""')
          .sort()
      ])
    );

    result.requiredAttachments = ['None', ...result.requiredAttachments];
    result.conditions = ['None', ...result.conditions];

    return result;
  }, [programs]);

  const value = {
    programs: filteredPrograms,
    allPrograms: programs,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
    filterOptions,
  };

  return <ProgramsContext.Provider value={value}>{children}</ProgramsContext.Provider>;
};

export const usePrograms = () => {
  const context = useContext(ProgramsContext);
  if (!context) {
    throw new Error('usePrograms must be used within a ProgramsProvider');
  }
  return context;
};
