import { useState, useRef, useEffect } from "react";
import { findGlossaryTerm, glossaryMap } from "../data/glossary";
import { X, BookOpen } from "lucide-react";

interface GlossaryTermProps {
  children: React.ReactNode;
  term?: string; // Optional: specify exact term to look up
  className?: string;
}

interface GlossaryPopupProps {
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
  onClose: () => void;
  position: { x: number; y: number };
  isMobile: boolean;
}

function GlossaryPopup({
  term,
  definition,
  category,
  relatedTerms = [],
  onClose,
  position,
  isMobile,
}: GlossaryPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const getCategoryColor = (cat: string) => {
    const colors = {
      protocol:
        "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
      network:
        "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
      security:
        "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
      web: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
      email:
        "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
      general:
        "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
    };
    return colors[cat as keyof typeof colors] || colors.general;
  };

  if (isMobile) {
    // Mobile: Full-screen modal
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div
          ref={popupRef}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {term}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Close definition"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category badge */}
            <div className="mb-3">
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                  category,
                )}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </div>

            {/* Definition */}
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {definition}
            </p>

            {/* Related terms */}
            {relatedTerms.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Related Terms:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {relatedTerms.map((relatedId) => {
                    const relatedTerm = glossaryMap.get(relatedId);
                    return relatedTerm ? (
                      <span
                        key={relatedId}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {relatedTerm.term}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Positioned tooltip
  const popupStyle = {
    position: "fixed" as const,
    left: Math.min(position.x, window.innerWidth - 320),
    top:
      position.y > window.innerHeight / 2 ? position.y - 200 : position.y + 20,
    zIndex: 1000,
  };

  return (
    <div style={popupStyle}>
      <div
        ref={popupRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-xs p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {term}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close definition"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Category badge */}
        <div className="mb-2">
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
              category,
            )}`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>

        {/* Definition */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
          {definition}
        </p>

        {/* Related terms */}
        {relatedTerms.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-1">
              Related:
            </h4>
            <div className="flex flex-wrap gap-1">
              {relatedTerms.slice(0, 3).map((relatedId) => {
                const relatedTerm = glossaryMap.get(relatedId);
                return relatedTerm ? (
                  <span
                    key={relatedId}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1 py-0.5 rounded"
                  >
                    {relatedTerm.term}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GlossaryTerm({
  children,
  term,
  className = "",
}: GlossaryTermProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();

    // Get the term to look up
    const termToFind = term || (typeof children === "string" ? children : "");
    const glossaryTerm = findGlossaryTerm(termToFind);

    if (!glossaryTerm) {
      console.warn(`Glossary term not found: ${termToFind}`);
      return;
    }

    // Set position for desktop tooltip
    setPosition({
      x: event.clientX,
      y: event.clientY,
    });

    setIsOpen(true);
  };

  // Get the term info for styling
  const termToFind = term || (typeof children === "string" ? children : "");
  const glossaryTerm = findGlossaryTerm(termToFind);

  if (!glossaryTerm) {
    // If no glossary term found, render as normal text
    return <span className={className}>{children}</span>;
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          inline border-b border-dotted border-blue-500 text-blue-600 hover:text-blue-800
          hover:border-blue-800 cursor-pointer bg-transparent p-0 font-inherit
          transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500
          focus:ring-opacity-50 rounded-sm ${className}
        `}
        aria-label={`Show definition for ${glossaryTerm.term}`}
        title={`Click to see definition of ${glossaryTerm.term}`}
      >
        {children}
      </button>

      {isOpen && (
        <GlossaryPopup
          term={glossaryTerm.term}
          definition={glossaryTerm.definition}
          category={glossaryTerm.category}
          relatedTerms={glossaryTerm.relatedTerms}
          onClose={() => setIsOpen(false)}
          position={position}
          isMobile={isMobile}
        />
      )}
    </>
  );
}
