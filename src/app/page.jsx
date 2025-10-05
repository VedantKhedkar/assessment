// src/app/page.jsx
"use client";

import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import AuthPage from '@/components/AuthPage';
import DashboardPage from '@/components/DashboardPage';
import ThemeToggle from '@/components/ThemeToggle';
import styles from './loader.module.css';

export default function HomePage() {
    const [view, setView] = useState('loading');
    const [theme, setTheme] = useState('light');

    // Effect to set the initial theme and apply class to HTML element
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;

        const token = localStorage.getItem('token');
        setView(token ? 'dashboard' : 'landing');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.className = newTheme;
    };

    const handleAuthSuccess = () => setView('dashboard');
    const handleLogout = () => {
        localStorage.removeItem('token');
        setView('landing');
    };

    const renderView = () => {
        switch (view) {
            case 'loading':
                return <div className={styles.loaderContainer}><div className={styles.loader}></div></div>;
            case 'landing':
                return <LandingPage onNavigateToAuth={() => setView('auth')} />;
            case 'auth':
                return <AuthPage onAuthSuccess={handleAuthSuccess} />;
            case 'dashboard':
                return <DashboardPage onLogout={handleLogout} />;
            default:
                return <LandingPage onNavigateToAuth={() => setView('auth')} />;
        }
    };

    return (
        <main>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {renderView()}
        </main>
    );
}