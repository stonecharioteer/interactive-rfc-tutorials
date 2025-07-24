import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";

interface MermaidDiagramProps {
  chart: string;
  id?: string;
  className?: string;
}

export default function MermaidDiagram({
  chart,
  id,
  className = "",
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { actualTheme } = useTheme();

  const renderDiagram = useCallback(async () => {
    if (!chart || typeof window === "undefined") {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSvgContent("");

      // Dynamically import mermaid
      const { default: mermaid } = await import("mermaid");

      // Initialize mermaid with theme-aware configuration
      const mermaidConfig: Record<string, unknown> = {
        startOnLoad: false,
        theme: actualTheme === "dark" ? "base" : "default", // Use 'base' theme for custom variables
        securityLevel: "loose",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: 14,
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: "basis",
        },
        sequence: {
          useMaxWidth: true,
          diagramMarginX: 20,
          diagramMarginY: 10,
          actorMargin: 50,
          width: 150,
          height: 65,
        },
        gantt: {
          useMaxWidth: true,
          leftPadding: 75,
          rightPadding: 20,
        },
      };

      // Add custom theme variables for dark mode with better contrast
      if (actualTheme === "dark") {
        mermaidConfig.themeVariables = {
          darkMode: true,
          background: "#1f2937",

          // Primary elements
          primaryColor: "#374151",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#6b7280",

          // Secondary elements
          secondaryColor: "#4b5563",
          secondaryTextColor: "#ffffff",
          secondaryBorderColor: "#6b7280",

          // Tertiary elements
          tertiaryColor: "#1f2937",
          tertiaryTextColor: "#ffffff",
          tertiaryBorderColor: "#6b7280",

          // Lines and arrows
          lineColor: "#9ca3af",
          textColor: "#ffffff",

          // Node fills - using colorblind-compatible, high contrast colors
          // Using Viridis-inspired palette for accessibility
          cScale0: "#2563eb", // blue-600 - good contrast
          cScale1: "#059669", // emerald-600 - good contrast
          cScale2: "#dc2626", // red-600 - good contrast
          cScale3: "#7c3aed", // violet-600 - good contrast
          cScale4: "#ea580c", // orange-600 - good contrast
          cScale5: "#0891b2", // cyan-600 - good contrast
          cScale6: "#4b5563", // gray-600 - good contrast
          cScale7: "#9333ea", // purple-600 - good contrast
          cScale8: "#2563eb", // blue-600 (repeat for consistency)
          cScale9: "#059669", // emerald-600 (repeat)
          cScale10: "#dc2626", // red-600 (repeat)
          cScale11: "#7c3aed", // violet-600 (repeat)

          // Additional overrides using same colorblind-safe palette
          fillType0: "#4b5563", // gray-600
          fillType1: "#2563eb", // blue-600
          fillType2: "#059669", // emerald-600
          fillType3: "#dc2626", // red-600
          fillType4: "#7c3aed", // violet-600
          fillType5: "#ea580c", // orange-600

          // Flowchart specific
          nodeBkg: "#374151",
          nodeTextColor: "#ffffff",
          mainBkg: "#374151",
          secondBkg: "#4b5563",
          tertiaryBkg: "#1f2937",
        };
      }

      mermaid.initialize(mermaidConfig);

      // Create a unique ID for this diagram
      const uniqueId =
        id ||
        `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Render the diagram
      const { svg } = await mermaid.render(uniqueId, chart);

      setSvgContent(svg);
      setIsLoading(false);
    } catch (err) {
      console.error("Mermaid rendering error:", err);
      setError(err instanceof Error ? err.message : "Failed to render diagram");
      setIsLoading(false);
    }
  }, [chart, id, actualTheme]);

  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  if (error) {
    return (
      <div className={`mermaid-container ${className}`}>
        <div className="flex justify-center items-center p-4 bg-red-50 border border-red-200 rounded">
          <div className="text-center">
            <span className="text-red-600 text-sm font-medium">
              Failed to render diagram
            </span>
            <p className="text-red-500 text-xs mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mermaid-container ${className}`}>
      <div
        ref={containerRef}
        className="flex justify-center items-center overflow-x-auto"
        style={{ minHeight: "200px" }}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
            <span className="text-sm">Loading diagram...</span>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: svgContent }}
            className="w-full flex justify-center"
          />
        )}
      </div>
    </div>
  );
}
