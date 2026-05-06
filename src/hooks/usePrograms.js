import { useState, useEffect, useMemo } from 'react';
import { parseExcelFile } from '../utils/excelParser';

export const usePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    degree: [],
    city: [],
    institution: [],
    language: [],
    gender: [],
    scholarship: [],
    studentType: [],
    requiredAttachments: [],
    conditions: [],
  });
  const [excludeKeys, setExcludeKeys] = useState(new Set());

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

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return true;

        const isExcludeMode = excludeKeys.has(key);
        const selectedValues = Array.isArray(value) ? value : [value];
        const hasNone = selectedValues.includes('None');
        const normalValues = selectedValues.filter(v => v !== 'None');

        // Logic for array fields (attachments, conditions)
        if (Array.isArray(program[key])) {
          const isEmpty = program[key].length === 0;

          if (isExcludeMode) {
            // Exclude if it has ANY of the selected normal values OR if None is selected and it is empty
            if (hasNone && isEmpty) return false;
            if (normalValues.some(val => program[key].includes(val))) return false;
            return true;
          } else {
            // Include if it has ANY of the selected normal values OR if None is selected and it is empty
            if (hasNone && isEmpty) return true;
            return normalValues.some(val => program[key].includes(val));
          }
        }

        // Logic for scalar fields (degree, city, etc.)
        if (isExcludeMode) {
          return !normalValues.some(val => program[key] === val);
        } else {
          return normalValues.some(val => program[key] === val);
        }
      });

      return matchesSearch && matchesFilters;
    });
  }, [programs, searchQuery, filters, excludeKeys]);

  const toggleExclude = (key) => {
    setExcludeKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const resetFilters = () => {
    setFilters({
      degree: [],
      city: [],
      institution: [],
      language: [],
      gender: [],
      scholarship: [],
      studentType: [],
      requiredAttachments: [],
      conditions: [],
    });
    setExcludeKeys(new Set());
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

    // Add 'None' option to relevant fields
    result.requiredAttachments = ['None', ...result.requiredAttachments];
    result.conditions = ['None', ...result.conditions];

    return result;
  }, [programs]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };



  return {
    programs: filteredPrograms,
    allPrograms: programs,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    excludeKeys,
    toggleExclude,
    updateFilter,
    resetFilters,
    filterOptions,
  };
};
