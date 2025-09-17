import React, { useState } from 'react';
import './style.scss';

interface HeaderProps {
    onToggleSidebar: () => void;
    sidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen = false }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-toggle" onClick={onToggleSidebar}>
                    {sidebarOpen ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        height={30}
                    />
            </div>

            <div className="header-center">
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search for anything"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <div className="header-right">
                <button className="docs-link">Docs</button>
                <button className="notification-btn">
                    <img src="/icons/bell.svg" alt="Notification" />
                </button>
                <div className="user-profile">
                    <div className="user-avatar">
                        <img src="/images/avatar.png" alt="User Avatar" />
                    </div>
                    <span className="user-name">Adedeji</span>
                    <button className="user-dropdown">
                        <img src="/icons/angle-down-fill.svg" alt="profile dropdown icon" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
