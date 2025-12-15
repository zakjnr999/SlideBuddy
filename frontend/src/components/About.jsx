import React from 'react';
import './About.css';

function About() {
    return (
        <div className="about-page">
            <div className="about-container">
                <div className="about-header">
                    <h1>About SlideBuddy</h1>
                    <p className="tagline">Your AI-powered study buddy for acing exams!</p>
                </div>

                <div className="about-content">
                    <section className="about-section">
                        <h2>🎓 Our Mission</h2>
                        <p>
                            SlideBuddy was created to help students study smarter, not harder. We believe that
                            technology should make learning easier and more accessible for everyone. By leveraging
                            the power of AI, we transform complex lecture slides into easy-to-understand summaries
                            and practice questions.
                        </p>
                    </section>

                    <section className="about-section">
                        <h2>💡 How It Works</h2>
                        <div className="steps-grid">
                            <div className="step">
                                <div className="step-number">1</div>
                                <h3>Upload</h3>
                                <p>Upload your lecture slides in PDF format</p>
                            </div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <h3>Process</h3>
                                <p>Our AI analyzes and extracts key information</p>
                            </div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <h3>Study</h3>
                                <p>Get summaries and practice questions instantly</p>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2>🚀 Why SlideBuddy?</h2>
                        <div className="benefits-list">
                            <div className="benefit">
                                <span className="benefit-icon">⚡</span>
                                <div>
                                    <h3>Save Time</h3>
                                    <p>Get comprehensive summaries in seconds instead of spending hours reading slides</p>
                                </div>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">🎯</span>
                                <div>
                                    <h3>Focus on What Matters</h3>
                                    <p>AI identifies and highlights the most important concepts from your lectures</p>
                                </div>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">📝</span>
                                <div>
                                    <h3>Practice Makes Perfect</h3>
                                    <p>Test your knowledge with AI-generated exam-style questions</p>
                                </div>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">💯</span>
                                <div>
                                    <h3>Ace Your Exams</h3>
                                    <p>Better preparation leads to better grades and deeper understanding</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2>🔒 Privacy & Security</h2>
                        <p>
                            Your privacy is our priority. All uploaded documents are processed securely and
                            deleted immediately after analysis. We don't store your PDFs or personal information.
                            Your study materials remain completely private.
                        </p>
                    </section>

                    <section className="about-section tech-section">
                        <h2>⚙️ Technology</h2>
                        <p>
                            SlideBuddy is powered by cutting-edge technology:
                        </p>
                        <div className="tech-stack">
                            <div className="tech-item">
                                <span>⚛️</span>
                                <p>React</p>
                            </div>
                            <div className="tech-item">
                                <span>🟢</span>
                                <p>Node.js</p>
                            </div>
                            <div className="tech-item">
                                <span>🤖</span>
                                <p>Google Gemini AI</p>
                            </div>
                            <div className="tech-item">
                                <span>📄</span>
                                <p>PDF Processing</p>
                            </div>
                        </div>
                    </section>

                    <section className="about-section cta-section">
                        <h2>Ready to Study Smarter?</h2>
                        <p>Join thousands of students who are already using SlideBuddy to ace their exams!</p>
                        <a href="/" className="cta-button">Get Started Now</a>
                    </section>
                </div>

                <div className="about-footer">
                    <p>Made with ❤️ for students everywhere</p>
                    <p className="version">Version 1.0.0</p>
                </div>
            </div>
        </div>
    );
}

export default About;
