import HomePage from './components/HomePage'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.scss'
import { Toaster } from 'react-hot-toast'

function AppContent() {
    return (
        <div className="app">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--theme-card-bg)',
                        color: 'var(--theme-text)',
                        borderRadius: '8px',
                        border: '2px solid var(--theme-border-color)',
                        fontFamily: 'var(--theme-font-body)'
                    },
                    success: {
                        icon: '✅'
                    },
                    error: {
                        icon: '❌'
                    }
                }}
            />

            <header className="app-header">
                <div className="app-header__content">
                    <div className="app-header__brand">
                        <img src="/skill_hub_logo.svg" alt="Skill Hub Logo" className="app-logo" />
                        <div className="app-header__text">
                            <h1>Discord 廣告生成器</h1>
                            <p className="subtitle">Skill Hub - 快速生成精美的社群宣傳圖片</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="app-main">
                <HomePage />
            </main>

            <footer className="app-footer">
                <p>© 2025 Skill Hub - Kemie, Ayn, 聖博老師の學習殿堂</p>
            </footer>
        </div>
    )
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    )
}

export default App
