import React from 'react';
import './Features.css';

function Features() {
    const features = [
        {
            icon: '📄',
            title: 'PDF Upload',
            description: 'Upload your lecture slides with drag-and-drop or click to browse. Supports PDFs up to 10MB.'
        },
        {
            icon: '🤖',
            title: 'AI-Powered Summaries',
            description: 'Get comprehensive summaries of your lecture slides using Google Gemini AI in seconds.'
        },
        {
            icon: '❓',
            title: 'Practice Questions',
            description: 'Generate 5 exam-style questions with detailed answers to test your understanding.'
        },
        {
            icon: '📋',
            title: 'Copy to Clipboard',
            description: 'Easily copy summaries and questions to use in your notes or study materials.'
        },
        {
            icon: '⚡',
            title: 'Fast Processing',
            description: 'Get results in seconds with our optimized AI processing pipeline.'
        },
        {
            icon: '🎨',
            title: 'Beautiful UI',
            description: 'Modern, clean interface designed specifically for students with smooth animations.'
        },
        {
            icon: '🔒',
            title: 'Secure & Private',
            description: 'Your documents are processed securely and deleted immediately after analysis.'
        },
        {
            icon: '💯',
            title: 'Free to Use',
            description: 'Completely free for students. No hidden fees, no subscriptions required.'
        }
    ];

    return (
        <div className="features-page">
            <div className="features-container">
                <div className="features-header">
                    <h1>Features</h1>
                    <p>Everything you need to study smarter, not harder</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className="coming-soon-section">
                    <div className="coming-soon-content">
                        <h2>📱 Mobile App Coming Soon!</h2>
                        <p>
                            We're working hard to bring SlideBuddy to your mobile devices.
                            Study on the go with our upcoming iOS and Android apps!
                        </p>
                        <div className="coming-soon-features">
                            <div className="mobile-feature">
                                <span>📸</span>
                                <p>Camera to PDF</p>
                            </div>
                            <div className="mobile-feature">
                                <span>💾</span>
                                <p>Offline Mode</p>
                            </div>
                            <div className="mobile-feature">
                                <span>🔔</span>
                                <p>Study Reminders</p>
                            </div>
                            <div className="mobile-feature">
                                <span>📊</span>
                                <p>Progress Tracking</p>
                            </div>
                        </div>
                        <p className="release-note">Expected release: 20th January 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Features;
