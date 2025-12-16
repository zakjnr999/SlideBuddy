import { useState, useEffect } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import Results from './components/Results'
import Header from './components/Header'
import Features from './components/Features'
import About from './components/About'
import Auth from './components/Auth'
import History from './components/History'

function App() {
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState('home')
    const [user, setUser] = useState(null)
    const [showAuth, setShowAuth] = useState(false)
    const [currentFilename, setCurrentFilename] = useState('')

    // Check for existing auth token on mount
    useEffect(() => {
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        if (token && savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    const handleAuthSuccess = (userData) => {
        setUser(userData)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setCurrentPage('home')
    }

    const handleFileUpload = async (file) => {
        setLoading(true)
        setError(null)
        setResults(null)
        setCurrentFilename(file.name)

        const formData = new FormData()
        formData.append('pdf', file)

        try {
            const response = await fetch('/api/process-pdf', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to process PDF')
            }

            const data = await response.json()
            setResults(data)

            // Auto-save to history if user is logged in
            if (user) {
                await saveToHistory(file.name, data.summary, data.questions)
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const saveToHistory = async (filename, summary, questions) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            await fetch('/api/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ filename, summary, questions })
            })
        } catch (err) {
            console.error('Error saving to history:', err)
        }
    }

    const handleReset = () => {
        setResults(null)
        setError(null)
    }

    return (
        <div className="app">
            <Header
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                user={user}
                onShowAuth={() => setShowAuth(true)}
                onLogout={handleLogout}
            />

            {currentPage === 'home' && (
                <main className="container">
                    {!results && !loading && (
                        <div className="hero fade-in">
                            <h1 className="hero-title">
                                Transform Your Study Materials
                                <span className="gradient-text">with AI</span>
                            </h1>
                            <p className="hero-subtitle">
                                Upload your lecture slides and get instant summaries, key points, and practice questions
                            </p>
                        </div>
                    )}

                    <FileUpload
                        onFileUpload={handleFileUpload}
                        loading={loading}
                        disabled={loading}
                    />

                    {error && (
                        <div className="error-message fade-in">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
                            </svg>
                            <p>{error}</p>
                        </div>
                    )}

                    {loading && (
                        <div className="loading-container fade-in">
                            <div className="loading-spinner"></div>
                            <p className="loading-text">Analyzing your PDF with AI...</p>
                            <p className="loading-subtext">This may take a few moments</p>
                        </div>
                    )}

                    {results && !loading && (
                        <Results results={results} onReset={handleReset} />
                    )}
                </main>
            )}

            {currentPage === 'features' && <Features />}
            {currentPage === 'about' && <About />}
            {currentPage === 'history' && <History />}

            <Auth
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                onAuthSuccess={handleAuthSuccess}
            />

            <footer className="footer">
                <p>Built with ❤️ for students | Powered by Google Gemini AI</p>
            </footer>
        </div>
    )
}

export default App
