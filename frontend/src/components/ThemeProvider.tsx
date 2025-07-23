import {
  createContext,
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
  const setTheme = () => {
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

// Export the context and types for the useTheme hook
export { ThemeContext, type ThemeContextType };
