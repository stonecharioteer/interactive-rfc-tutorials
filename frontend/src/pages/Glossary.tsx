import { useState, useMemo } from "react";
import { Search, BookOpen, Filter } from "lucide-react";
import { glossaryTerms } from "../data/glossary";

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(glossaryTerms.map(term => term.category)));
    return ["all", ...cats.sort()];
  }, []);

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = 
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "all" || term.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedCategory]);

  const getCategoryColor = (category: string) => {
    const colors = {
      protocol: "bg-blue-50 text-blue-700 border-blue-200",
      network: "bg-green-50 text-green-700 border-green-200", 
      security: "bg-red-50 text-red-700 border-red-200",
      web: "bg-purple-50 text-purple-700 border-purple-200",
      email: "bg-yellow-50 text-yellow-700 border-yellow-200",
      general: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "protocol": return "🌐";
      case "network": return "🔗";
      case "security": return "🔒";
      case "web": return "💻";
      case "email": return "📧";
      default: return "📚";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              RFC Tutorial Glossary
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Comprehensive definitions of networking, security, and protocol terms used throughout the RFC tutorials.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              {filteredTerms.length} terms
            </span>
            <span>•</span>
            <span>{categories.length - 1} categories</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search terms or definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : 
                     category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Terms Grid */}
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No terms found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term) => (
              <div
                key={term.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Term Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {term.term}
                    </h3>
                    <span className="text-2xl">
                      {getCategoryIcon(term.category)}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                        term.category
                      )}`}
                    >
                      {term.category.charAt(0).toUpperCase() + term.category.slice(1)}
                    </span>
                  </div>

                  {/* Definition */}
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {term.definition}
                  </p>

                  {/* Related Terms */}
                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Related Terms:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {term.relatedTerms.slice(0, 4).map((relatedId) => {
                          const relatedTerm = glossaryTerms.find(t => t.id === relatedId);
                          return relatedTerm ? (
                            <span
                              key={relatedId}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {relatedTerm.term}
                            </span>
                          ) : null;
                        })}
                        {term.relatedTerms.length > 4 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{term.relatedTerms.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Glossary Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(1).map(category => {
              const count = glossaryTerms.filter(t => t.category === category).length;
              return (
                <div
                  key={category}
                  className={`p-4 rounded-lg border ${getCategoryColor(category)}`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">
                      {getCategoryIcon(category)}
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {count}
                    </div>
                    <div className="text-xs uppercase font-medium">
                      {category}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}