import { rfcTags, RfcTag } from "../data/rfcs";
import { X } from "lucide-react";

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagFilter({ selectedTags, onTagsChange }: TagFilterProps) {
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(t => t !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  // Group tags by category for better organization
  const tagsByCategory = Object.values(rfcTags).reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, RfcTag[]>);

  const categoryNames = {
    protocol: "Protocol Layer",
    technology: "Technology Focus",
    level: "Learning Level",
    relevance: "Industry Relevance"
  };

  if (Object.keys(tagsByCategory).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Selected tags summary */}
      {selectedTags.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Selected Tags ({selectedTags.length})
            </span>
            <button
              onClick={clearAllTags}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tagId) => {
              const tag = rfcTags[tagId];
              if (!tag) return null;
              return (
                <button
                  key={tagId}
                  onClick={() => toggleTag(tagId)}
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${tag.color} hover:opacity-80`}
                >
                  {tag.name}
                  <X className="h-3 w-3 ml-1" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tag selection by category */}
      {Object.entries(tagsByCategory).map(([category, tags]) => (
        <div key={category}>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {categoryNames[category as keyof typeof categoryNames]}
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? `text-white ${tag.color}`
                      : "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  title={tag.description}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}