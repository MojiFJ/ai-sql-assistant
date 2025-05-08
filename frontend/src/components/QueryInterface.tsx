
import React, { useState, FormEvent } from 'react';

interface BackendResponse {
    sqlQuery: string;
    explanation: string;
    optimizationSuggestions: string;
    error?: string; 
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const QueryInterface: React.FC = () => {
    const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>('');
    const [sqlDialect, setSqlDialect] = useState<string>('PostgreSQL');
    const [result, setResult] = useState<BackendResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null); 

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!naturalLanguageQuery.trim()) {
            setError("Please enter a query.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ naturalLanguageQuery, sqlDialect }),
            });

            const data: BackendResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! Status: ${response.status}`);
            }
            setResult(data);
        } catch (err) {
            setError((err as Error).message);
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="query-interface-container"> 
            <h2>AI SQL Developer Assistant</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <textarea
                        value={naturalLanguageQuery}
                        onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                        placeholder="Describe what data you want (e.g., 'Show me all customers from New York who ordered product X')"
                        rows={5}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="sqlDialect" style={{ marginRight: '10px', display: 'block', marginBottom: '5px', fontWeight:'bold' }}>SQL Dialect:</label>
                    <select
                        id="sqlDialect"
                        value={sqlDialect}
                        onChange={(e) => setSqlDialect(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="PostgreSQL">PostgreSQL</option>
                        <option value="MySQL">MySQL</option>
                        <option value="SQLite">SQLite</option>
                        <option value="Oracle">Oracle PL/SQL</option>
                    </select>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Generate SQL'}
                </button>
            </form>

            {isLoading && <p className="loading-message">Analyzing your request...</p>}
            {error && <p className="error-message">Error: {error}</p>}

            {result && (
                <div style={{ marginTop: '25px' }}>
                    <h3>Generated SQL Query:</h3>
                    <pre><code>{result.sqlQuery}</code></pre>

                    <h3>Explanation:</h3>
                    <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{result.explanation}</p>

                    <h3>Optimization Suggestions:</h3>
                    <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{result.optimizationSuggestions}</p>
                </div>
            )}
        </div>
    );
};

export default QueryInterface;
