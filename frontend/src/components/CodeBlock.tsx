import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export default function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = true,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { actualTheme } = useTheme();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Theme-aware styling
  const isDark = actualTheme === "dark";
  const syntaxStyle = isDark ? oneDark : oneLight;

  return (
    <div
      className={`relative group rounded-lg overflow-hidden border ${
        isDark ? "border-gray-700" : "border-gray-300"
      } ${className}`}
    >
      {/* Header with title and copy button */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2">
          {title && (
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {title}
            </span>
          )}
          <span
            className={`text-xs px-2 py-1 rounded ${
              isDark ? "text-gray-400 bg-gray-700" : "text-gray-600 bg-gray-200"
            }`}
          >
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                     isDark
                       ? "text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600"
                       : "text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300"
                   }`}
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={syntaxStyle}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: isDark ? "#1e1e1e" : "#fafafa",
            fontSize: "0.875rem",
          }}
          lineNumberStyle={{
            color: isDark ? "#6b7280" : "#9ca3af",
            marginRight: "1rem",
            userSelect: "none",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// Convenience component for Python code
interface PythonCodeProps {
  code: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function PythonCode({
  code,
  title,
  showLineNumbers = true,
  className,
}: PythonCodeProps) {
  return (
    <CodeBlock
      code={code}
      language="python"
      title={title}
      showLineNumbers={showLineNumbers}
      className={className}
    />
  );
}

// Convenience component for shell/bash code
interface ShellCodeProps {
  code: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function ShellCode({
  code,
  title,
  showLineNumbers = false,
  className,
}: ShellCodeProps) {
  return (
    <CodeBlock
      code={code}
      language="bash"
      title={title}
      showLineNumbers={showLineNumbers}
      className={className}
    />
  );
}
