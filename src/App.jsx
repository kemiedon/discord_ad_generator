import HomePage from './components/HomePage'
import './App.scss'

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <h1>Discord 廣告生成器</h1>
                <p className="subtitle">Skill Hub - 快速生成精美的社群宣傳圖片</p>
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

export default App
