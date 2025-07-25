import { useState, useMemo } from 'react';
import { RfcMetadata } from '../data/rfcs';

export interface FilterState {
  searchTerm: string;
  selectedEra: string;
  selectedYear: string;
  completedOnly: boolean;
  selectedTags: string[];
}

export function useRfcFilter(rfcs: RfcMetadata[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedEra: 'all',
    selectedYear: 'all',
    completedOnly: false,
    selectedTags: [],
  });

  // Get completed RFCs from localStorage
  const completedRfcs = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('rfc-progress') || '[]') as number[];
    } catch {
      return [];
    }
  }, []);

  const filteredRfcs = useMemo(() => {
    return rfcs.filter((rfc) => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          rfc.title.toLowerCase().includes(searchLower) ||
          rfc.description.toLowerCase().includes(searchLower) ||
          rfc.number.toString().includes(searchLower) ||
          rfc.learningObjectives.some(obj => obj.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Era filter
      if (filters.selectedEra !== 'all' && rfc.era !== filters.selectedEra) {
        return false;
      }

      // Year filter
      if (filters.selectedYear !== 'all') {
        const decade = Math.floor(rfc.year / 10) * 10;
        const selectedDecade = filters.selectedYear.replace('s', '');
        if (decade.toString() !== selectedDecade) {
          return false;
        }
      }

      // Completion status filter
      if (filters.completedOnly && !completedRfcs.includes(rfc.number)) {
        return false;
      }

      // Tag filter - RFC must have ALL selected tags
      if (filters.selectedTags.length > 0) {
        const hasAllTags = filters.selectedTags.every(tagId => 
          rfc.tags && rfc.tags.includes(tagId)
        );
        if (!hasAllTags) {
          return false;
        }
      }

      return true;
    });
  }, [rfcs, filters, completedRfcs]);

  const updateFilter = (key: keyof FilterState, value: string | boolean | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedEra: 'all',
      selectedYear: 'all',
      completedOnly: false,
      selectedTags: [],
    });
  };

  const getFilterStats = () => {
    const totalRfcs = rfcs.length;
    const filteredCount = filteredRfcs.length;
    const completedCount = rfcs.filter(rfc => completedRfcs.includes(rfc.number)).length;
    
    return {
      total: totalRfcs,
      filtered: filteredCount,
      completed: completedCount,
      completionRate: totalRfcs > 0 ? Math.round((completedCount / totalRfcs) * 100) : 0,
    };
  };

  return {
    filters,
    filteredRfcs,
    updateFilter,
    clearFilters,
    stats: getFilterStats(),
  };
}