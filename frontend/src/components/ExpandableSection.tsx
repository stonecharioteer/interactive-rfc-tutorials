import { useState } from "react";
import { ChevronDown, ChevronUp, Code } from "lucide-react";

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export default function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
  className = "",
  icon,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r
                   from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20
                   hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30
                   transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-expanded={isExpanded}
        aria-controls={`expandable-content-${title
          .replace(/\s+/g, "-")
          .toLowerCase()}`}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <h3 className="text-left font-semibold text-gray-900 dark:text-white text-lg">
            {title}
          </h3>
        </div>

        <div className="flex-shrink-0 ml-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </div>
      </button>

      <div
        id={`expandable-content-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-none opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}

// Specialized component for ELI-Pythonista sections
interface EliPythonistaSectionProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function EliPythonistaSection({
  children,
  defaultExpanded = false,
  className = "",
}: EliPythonistaSectionProps) {
  return (
    <ExpandableSection
      title="ELI-Pythonista: Understanding with Code"
      defaultExpanded={defaultExpanded}
      className={className}
      icon={<Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
    >
      <div className="prose prose-lg max-w-none">{children}</div>
    </ExpandableSection>
  );
}

// Specialized component for technical deep dives
interface TechnicalDeepDiveProps {
  title?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function TechnicalDeepDive({
  title = "Technical Deep Dive",
  children,
  defaultExpanded = false,
  className = "",
}: TechnicalDeepDiveProps) {
  return (
    <ExpandableSection
      title={title}
      defaultExpanded={defaultExpanded}
      className={className}
      icon={
        <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-red-500 rounded-full" />
      }
    >
      <div className="prose prose-lg max-w-none">{children}</div>
    </ExpandableSection>
  );
}
