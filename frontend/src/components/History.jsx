import React, { useState, useEffect } from 'react';
import './History.css';

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please sign in to view history');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }

            const data = await response.json();
            setHistory(data.history);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/history/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            // Remove from state
            setHistory(history.filter(item => item._id !== id));
            setSelectedItem(null);
        } catch (err) {
            alert('Error deleting item: ' + err.message);
        }
    };

    const clearAll = async () => {
        if (!window.confirm('Are you sure you want to clear all history?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/history', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to clear history');
            }

            setHistory([]);
            setSelectedItem(null);
        } catch (err) {
            alert('Error clearing history: ' + err.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="history-page">
                <div className="history-container">
                    <div className="loading-spinner"></div>
                    <p>Loading history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="history-page">
                <div className="history-container">
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="history-page">
            <div className="history-container">
                <div className="history-header">
                    <h1>Your History</h1>
                    <p>View all your processed PDFs</p>
                    {history.length > 0 && (
                        <button onClick={clearAll} className="clear-all-btn">
                            Clear All
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📚</div>
                        <h2>No history yet</h2>
                        <p>Process your first PDF to see it here!</p>
                    </div>
                ) : (
                    <div className="history-grid">
                        {history.map((item) => (
                            <div
                                key={item._id}
                                className="history-card"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="card-header">
                                    <div className="file-icon">📄</div>
                                    <h3>{item.filename}</h3>
                                </div>
                                <p className="card-date">{formatDate(item.processedAt)}</p>
                                <p className="card-preview">
                                    {item.summary.substring(0, 150)}...
                                </p>
                                <div className="card-footer">
                                    <span className="question-count">
                                        {item.questions.length} questions
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteItem(item._id);
                                        }}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedItem && (
                    <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
                        <div className="history-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setSelectedItem(null)}>×</button>

                            <div className="modal-header">
                                <h2>{selectedItem.filename}</h2>
                                <p className="modal-date">{formatDate(selectedItem.processedAt)}</p>
                            </div>

                            <div className="modal-content">
                                <section className="modal-section">
                                    <h3>Summary</h3>
                                    <p>{selectedItem.summary}</p>
                                </section>

                                <section className="modal-section">
                                    <h3>Practice Questions</h3>
                                    {selectedItem.questions.map((q, index) => (
                                        <div key={index} className="question-item">
                                            <h4>Q{index + 1}: {q.question}</h4>
                                            <p>{q.answer}</p>
                                        </div>
                                    ))}
                                </section>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default History;
