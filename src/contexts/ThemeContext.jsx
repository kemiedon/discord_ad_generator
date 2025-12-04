import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const THEMES = {
  MINECRAFT: 'minecraft'
}

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(THEMES.MINECRAFT)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEMES.MINECRAFT)
  }, [])

  const toggleTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      setCurrentTheme(theme)
    }
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme: toggleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
