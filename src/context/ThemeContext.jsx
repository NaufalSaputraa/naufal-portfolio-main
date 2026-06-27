import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Default to 'professional' mode (isProMode = true)
    const [isProMode, setIsProMode] = useState(true);

    // Load preference from local storage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem('ns_portfolio_mode');
        if (savedMode === 'hacker') {
            setIsProMode(false);
        } else {
            setIsProMode(true);
        }
    }, []);

    // Sync dark class on document element
    useEffect(() => {
        if (isProMode) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }, [isProMode]);

    const toggleMode = () => {
        setIsProMode((prev) => {
            const newMode = !prev;
            localStorage.setItem('ns_portfolio_mode', newMode ? 'professional' : 'hacker');
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ isProMode, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
