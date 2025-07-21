import { useEffect, useRef, useState, useCallback } from "react";

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

      // Initialize mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
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
      });

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
  }, [chart, id]);

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
