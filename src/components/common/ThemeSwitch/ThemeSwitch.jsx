import { useTheme, THEMES } from '../../../contexts/ThemeContext'
import './ThemeSwitch.scss'

function ThemeSwitch() {
  const { currentTheme, setCurrentTheme } = useTheme()

  return (
    <div className="theme-switch">
      <div className="theme-switch__label">SELECT THEME:</div>
      <div className="theme-switch__options">
        <button
          className={`theme-btn theme-btn--minecraft ${currentTheme === THEMES.MINECRAFT ? 'active' : ''}`}
          onClick={() => setCurrentTheme(THEMES.MINECRAFT)}
          title="Minecraft Style"
        >
          <span className="icon">⛏️</span>
        </button>
        <button
          className={`theme-btn theme-btn--gameboy ${currentTheme === THEMES.GAMEBOY ? 'active' : ''}`}
          onClick={() => setCurrentTheme(THEMES.GAMEBOY)}
          title="Gameboy Style"
        >
          <span className="icon">👾</span>
        </button>
        <button
          className={`theme-btn theme-btn--mario ${currentTheme === THEMES.MARIO ? 'active' : ''}`}
          onClick={() => setCurrentTheme(THEMES.MARIO)}
          title="Mario Style"
        >
          <span className="icon">🍄</span>
        </button>
      </div>
    </div>
  )
}

export default ThemeSwitch
