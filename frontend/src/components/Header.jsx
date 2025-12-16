import './Header.css'

function Header({ currentPage, setCurrentPage, user, onShowAuth, onLogout, theme, onToggleTheme }) {
    const handleNavClick = (page) => {
        setCurrentPage(page)
    }

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="8" fill="url(#gradient)" />
                        <path d="M16 8L20 12H18V20H14V12H12L16 8Z" fill="white" />
                        <path d="M10 22H22V24H10V22Z" fill="white" />
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                                <stop offset="0%" stopColor="#667eea" />
                                <stop offset="100%" stopColor="#764ba2" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="logo-text">SlideBuddy</span>
                </div>

                <nav className="nav">
                    <button
                        onClick={() => handleNavClick('features')}
                        className={`nav-link ${currentPage === 'features' ? 'active' : ''}`}
                    >
                        Features
                    </button>
                    <button
                        onClick={() => handleNavClick('about')}
                        className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
                    >
                        About
                    </button>

                    {user && (
                        <button
                            onClick={() => handleNavClick('history')}
                            className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
                        >
                            History
                        </button>
                    )}

                    <button onClick={onToggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'dark' ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 2V4M10 16V18M4 10H2M18 10H16M15.657 4.343L14.243 5.757M5.757 14.243L4.343 15.657M15.657 15.657L14.243 14.243M5.757 5.757L4.343 4.343M13 10C13 11.657 11.657 13 10 13C8.343 13 7 11.657 7 10C7 8.343 8.343 7 10 7C11.657 7 13 8.343 13 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M17 10.5C16.1 13.5 13.4 15.7 10.2 15.7C6.3 15.7 3.1 12.5 3.1 8.6C3.1 5.4 5.3 2.7 8.3 1.8C8.1 2.3 8 2.9 8 3.5C8 6.5 10.5 9 13.5 9C14.1 9 14.7 8.9 15.2 8.7C15.6 9.4 15.9 10.2 16 11C16.3 10.8 16.7 10.6 17 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>

                    {user ? (
                        <div className="user-menu">
                            <span className="user-name">👋 {user.name}</span>
                            <button onClick={onLogout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button onClick={onShowAuth} className="signin-btn">
                            Sign In
                        </button>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header
