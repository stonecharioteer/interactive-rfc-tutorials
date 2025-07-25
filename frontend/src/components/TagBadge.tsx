import { rfcTags } from "../data/rfcs";

interface TagBadgeProps {
  tagId: string;
  size?: "sm" | "md";
  showTooltip?: boolean;
}

export default function TagBadge({ 
  tagId, 
  size = "sm", 
  showTooltip = true 
}: TagBadgeProps) {
  const tag = rfcTags[tagId];
  
  if (!tag) {
    return null; // Gracefully handle missing tags
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  const categoryIcons = {
    protocol: "🔗",
    technology: "⚡",
    level: "📊",
    relevance: "🎯",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium bg-white border ${tag.borderColor} ${tag.textColor} ${sizeClasses[size]} ${
        showTooltip ? "cursor-help" : ""
      }`}
      title={showTooltip ? `${tag.name}: ${tag.description}` : undefined}
    >
      <span className="mr-1" aria-hidden="true">
        {categoryIcons[tag.category]}
      </span>
      {tag.name}
    </span>
  );
}