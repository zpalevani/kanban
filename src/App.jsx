import React, { useEffect } from 'react'
import KanbanBoard from './components/KanbanBoard'
import { useLocalStorage } from './hooks/useLocalStorage'
import { STORAGE_KEYS } from './utils/constants'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useLocalStorage(STORAGE_KEYS.DARK_MODE, true)

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [darkMode])

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-left">
          <span className="made-by">Made by Zara Palevani</span>
        </div>
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="app-main">
        <KanbanBoard />
      </main>
    </div>
  )
}

export default App
