// src/components/ThemeToggle.jsx
"use client";

export default function ThemeToggle({ theme, toggleTheme }) {
    return (
        <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 px-4 py-2 bg-[var(--card-bg-color)] border border-[var(--border-color)] rounded-lg shadow text-sm font-medium"
        >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
    );
}