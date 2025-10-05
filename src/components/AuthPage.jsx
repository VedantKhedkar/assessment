// src/components/AuthPage.jsx
"use client";

import { useState } from 'react';

export default function AuthPage({ onAuthSuccess }) {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'An error occurred.');

            if (isLoginView) {
                localStorage.setItem('token', data.token);
                onAuthSuccess();
            } else {
                alert('Registration successful! Please log in.');
                setIsLoginView(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card-bg-color)' }}>
                <h1 className="text-2xl font-bold text-center" style={{ color: 'var(--text-color)' }}>
                    {isLoginView ? 'Login to Your Vault' : 'Create Your Account'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                            style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }} />
                    </div>
                    <div>
                        <label className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                            style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }} />
                    </div>
                    {error && <p className="text-sm text-center text-red-600">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        {loading ? 'Processing...' : (isLoginView ? 'Login' : 'Register')}
                    </button>
                </form>
                <p className="text-sm text-center" style={{ color: 'var(--text-color)' }}>
                    {isLoginView ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-indigo-600 hover:underline ml-1">
                        {isLoginView ? 'Register' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
}