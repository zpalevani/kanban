import React, { useEffect } from 'react'
import KanbanBoard from './components/KanbanBoard'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { STORAGE_KEYS } from './utils/constants'
import './App.css' // This file will also be updated

function App() {
  const [darkMode, setDarkMode] = useLocalStorage(STORAGE_KEYS.DARK_MODE, true)

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [darkMode])

  useKeyboardShortcuts([
    {
      key: 't',
      ctrl: true,
      handler: () => setDarkMode(prev => !prev)
    }
  ])

  return (
    <div className={`app`}> {/* The data-theme attribute on the body now handles the styling */}
      <header className="app-header">
        <div className="header-left">
          <span className="made-by">Made by Zara Palevani</span>
          <span className="keyboard-hint" title="Press Ctrl+T to toggle theme">
            ⌨️ Ctrl+T
          </span>
        </div>

        {/* --- UPDATED BUTTON WITH SVG ICONS --- */}
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            // Sun Icon (shown in dark mode to switch TO light mode)
            <svg key="sun" className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            // Moon Icon (shown in light mode to switch TO dark mode)
            <svg key="moon" className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </header>
      <main className="app-main">
        <KanbanBoard />
      </main>
    </div>
  )
}

export default App
