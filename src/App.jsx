import React, { useState, useEffect } from 'react'
import KanbanBoard from './components/KanbanBoard'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode')
      return saved ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode))
    } catch (e) {
      console.error('Error saving dark mode preference:', e)
    }
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
