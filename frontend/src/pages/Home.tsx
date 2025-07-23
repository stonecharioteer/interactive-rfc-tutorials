import { Link } from "react-router-dom";
import { rfcs, rfcEras } from "../data/rfcs";
import { CheckCircle2, FileText, Clock, Award, BarChart3 } from "lucide-react";
import RfcBadge from "../components/RfcBadge";
import SearchFilter from "../components/SearchFilter";
import { useRfcFilter } from "../hooks/useRfcFilter";

export default function Home() {
  const {
    filters,
    filteredRfcs,
    updateFilter,
    clearFilters,
    stats,
  } = useRfcFilter(rfcs);

  const completedRfcs = JSON.parse(
    localStorage.getItem("rfc-progress") || "[]",
  );

  const getEraRfcs = (era: string) => {
    if (filters.searchTerm || filters.selectedEra !== 'all' || filters.selectedYear !== 'all' || filters.completedOnly) {
      // When filtering is active, show filtered results grouped by era
      return filteredRfcs.filter((rfc) => rfc.era === era);
    }
    // Normal era grouping when no filters are active
    return rfcs.filter((rfc) => rfc.era === era);
  };

  const shouldShowEraGrouping = !filters.searchTerm && filters.selectedEra === 'all';
  const hasActiveFilters = filters.searchTerm || filters.selectedEra !== 'all' || filters.selectedYear !== 'all' || filters.completedOnly;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          Learn the RFCs That Built the Internet
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Interactive tutorials for understanding the key protocols and
          standards that power our connected world. Progress through the eras of
          internet development, from TCP/IP to modern web standards.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <Award className="h-8 w-8 text-rfc-blue mx-auto" />
            <h3 className="mt-2 font-semibold dark:text-white">{stats.total} Key RFCs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Carefully selected protocols that shaped the internet
            </p>
          </div>
          <div className="text-center">
            <BarChart3 className="h-8 w-8 text-rfc-green mx-auto" />
            <h3 className="mt-2 font-semibold dark:text-white">{stats.completionRate}% Complete</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {stats.completed} of {stats.total} RFCs completed
            </p>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-rfc-amber mx-auto" />
            <h3 className="mt-2 font-semibold dark:text-white">Self-Paced</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Learn at your own speed with progress tracking
            </p>
          </div>
          <div className="text-center">
            <CheckCircle2 className="h-8 w-8 text-rfc-purple mx-auto" />
            <h3 className="mt-2 font-semibold dark:text-white">
              Mobile Friendly
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Study on any device, anywhere
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={filters.searchTerm}
        onSearchChange={(term) => updateFilter('searchTerm', term)}
        selectedEra={filters.selectedEra}
        onEraChange={(era) => updateFilter('selectedEra', era)}
        selectedYear={filters.selectedYear}
        onYearChange={(year) => updateFilter('selectedYear', year)}
        completedOnly={filters.completedOnly}
        onCompletedOnlyChange={(completed) => updateFilter('completedOnly', completed)}
        onClearFilters={clearFilters}
      />

      {/* Filter Results Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Showing {stats.filtered} of {stats.total} RFCs
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                {filters.searchTerm && `Search: "${filters.searchTerm}"`}
                {filters.selectedEra !== 'all' && ` • Era: ${rfcEras[filters.selectedEra].name}`}
                {filters.selectedYear !== 'all' && ` • Year: ${filters.selectedYear}`}
                {filters.completedOnly && ` • Completed only`}
              </p>
            </div>
            {stats.filtered === 0 && (
              <div className="text-blue-600 dark:text-blue-400">
                <FileText className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* RFC Display */}
      {shouldShowEraGrouping ? (
        /* Era-based grouping (default view) */
        Object.entries(rfcEras).map(([eraKey, era]) => {
          const eraRfcs = getEraRfcs(eraKey);
          if (eraRfcs.length === 0) return null;

          return (
            <div key={eraKey} className="space-y-6">
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-white ${era.color}`}
                >
                  <h2 className="text-2xl font-bold">{era.name}</h2>
                  <span className="ml-3 text-sm opacity-90">{era.period}</span>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {era.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eraRfcs.map((rfc) => {
                  const isCompleted = completedRfcs.includes(rfc.number);

                  return (
                    <Link
                      key={rfc.number}
                      to={`/rfc/${rfc.number}`}
                      className="rfc-card hover:scale-105 transform transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          )}
                          <RfcBadge
                            number={rfc.number}
                            size="sm"
                            variant="minimal"
                          />
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {rfc.year}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {rfc.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                        {rfc.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        /* Filtered results view */
        <div className="space-y-6">
          {stats.filtered === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No RFCs found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRfcs.map((rfc) => {
                const isCompleted = completedRfcs.includes(rfc.number);
                const era = rfcEras[rfc.era];

                return (
                  <Link
                    key={rfc.number}
                    to={`/rfc/${rfc.number}`}
                    className="rfc-card hover:scale-105 transform transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                        <RfcBadge
                          number={rfc.number}
                          size="sm"
                          variant="minimal"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs text-white ${era.color}`}>
                          {era.name}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {rfc.year}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {rfc.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {rfc.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Progress
        </h2>
        <div className="flex items-center justify-center space-x-8">
          <div>
            <div className="text-3xl font-bold text-rfc-blue">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Completed
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-400 dark:text-gray-400">
              {stats.total - stats.completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Remaining
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-rfc-green">
              {stats.completionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Progress
            </div>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-rfc-blue h-3 rounded-full transition-all duration-300"
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
        {hasActiveFilters && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Showing {stats.filtered} RFCs based on current filters
          </p>
        )}
      </div>
    </div>
  );
}
