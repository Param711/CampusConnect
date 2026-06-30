import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useDashboard();

  return (
    <button 
      onClick={() => setDarkMode(!darkMode)}
      className="theme-toggle-btn"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <Sun size={18} style={{ animation: 'spin 10s linear infinite' }} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
};

export default ThemeToggle;
