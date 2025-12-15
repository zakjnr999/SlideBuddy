import './Header.css'

function Header({ currentPage, setCurrentPage }) {
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
                </nav>
            </div>
        </header>
    )
}

export default Header
