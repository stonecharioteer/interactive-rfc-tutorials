import { useState } from 'react';
import { Search, Filter, X, Tag } from 'lucide-react';
import { rfcEras } from '../data/rfcs';
import TagFilter from './TagFilter';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedEra: string;
  onEraChange: (era: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  completedOnly: boolean;
  onCompletedOnlyChange: (completed: boolean) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onClearFilters: () => void;
}

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedEra,
  onEraChange,
  selectedYear,
  onYearChange,
  completedOnly,
  onCompletedOnlyChange,
  selectedTags,
  onTagsChange,
  onClearFilters,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);

  const hasActiveFilters = selectedEra !== 'all' || selectedYear !== 'all' || completedOnly || selectedTags.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search RFCs by title, description, or number..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Active
              </span>
            )}
          </button>

          <button
            onClick={() => setShowTagFilter(!showTagFilter)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Tag className="h-4 w-4 mr-2" />
            Tags
            {selectedTags.length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                {selectedTags.length}
              </span>
            )}
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Era Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Era
              </label>
              <select
                value={selectedEra}
                onChange={(e) => onEraChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Eras</option>
                {Object.entries(rfcEras).map(([key, era]) => (
                  <option key={key} value={key}>
                    {era.name} ({era.period})
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Publication Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Years</option>
                <option value="1960s">1960s</option>
                <option value="1970s">1970s</option>
                <option value="1980s">1980s</option>
                <option value="1990s">1990s</option>
                <option value="2000s">2000s</option>
                <option value="2010s">2010s</option>
                <option value="2020s">2020s</option>
              </select>
            </div>

            {/* Completion Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Progress
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="completed-only"
                  checked={completedOnly}
                  onChange={(e) => onCompletedOnlyChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label
                  htmlFor="completed-only"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Show only completed RFCs
                </label>
              </div>
            </div>
          </div>

          {/* Quick Era Filters */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Era Selection:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onEraChange('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedEra === 'all'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {Object.entries(rfcEras).map(([key, era]) => (
                <button
                  key={key}
                  onClick={() => onEraChange(key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedEra === key
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {era.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tag Filter */}
      {showTagFilter && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <TagFilter
            selectedTags={selectedTags}
            onTagsChange={onTagsChange}
          />
        </div>
      )}
    </div>
  );
}