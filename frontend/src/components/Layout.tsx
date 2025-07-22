import React from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen, Clock } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-rfc-blue" />
              <span className="text-xl font-bold text-gray-900">
                RFC Tutorial
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Progress: {getProgress()}%</span>
              </div>
              {/* Theme toggle hidden for now */}
              {/* <ThemeToggle /> */}
            </nav>

            {/* Mobile navigation - theme toggle hidden */}
            <div className="md:hidden">{/* <ThemeToggle /> */}</div>

            {/* Mobile menu button */}
            <button className="hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>
              &copy; 2025 RFC Tutorial. Learn the standards that built the
              internet.
            </p>
            <p className="mt-2 text-sm">
              Progress is saved locally in your browser. No account required.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple progress tracking using localStorage
function getProgress(): number {
  const completed = JSON.parse(localStorage.getItem("rfc-progress") || "[]");
  const total = 5; // Update this as we add more RFCs
  return Math.round((completed.length / total) * 100);
}
