import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize theme to light mode by default, ignore system/localStorage
  const [theme, setThemeState] = useState<Theme>("light");

  // Always use light theme for now
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  // Function to get system preference
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  // Force light mode and ensure DOM is updated
  useEffect(() => {
    setActualTheme("light");

    // Always set light mode in DOM
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  // Set theme function (kept for compatibility, but forces light mode)
  const setTheme = (newTheme: Theme) => {
    // For now, ignore the theme change and stay on light mode
    setThemeState("light");
  };

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
