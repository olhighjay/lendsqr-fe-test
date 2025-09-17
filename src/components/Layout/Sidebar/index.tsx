import React from 'react';
import './style.scss';

interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
    onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout }) => {
    const menuItems = [
        {
            section: '',
            items: [
                { name: 'Dashboard', icon: '/icons/home.svg', active: false }
            ]
        },
        {
            section: 'CUSTOMERS',
            items: [
                { name: 'Users', icon: '/icons/user-friends.svg', active: true },
                { name: 'Guarantors', icon: '/icons/users.svg', active: false },
                { name: 'Loans', icon: '/icons/sack.svg', active: false },
                { name: 'Decision Models', icon: '/icons/handshake-regular.svg', active: false },
                { name: 'Savings', icon: '/icons/piggy-bank.svg', active: false },
                { name: 'Loan Requests', icon: '/icons/group.svg', active: false },
                { name: 'Whitelist', icon: '/icons/user-check.svg', active: false },
                { name: 'Karma', icon: '/icons/user-times.svg', active: false }
            ]
        },
        {
            section: 'BUSINESSES',
            items: [
                { name: 'Organization', icon: '/icons/briefcase.svg', active: false },
                { name: 'Loan Products', icon: '/icons/group.svg', active: false },
                { name: 'Savings Products', icon: '/icons/bank.svg', active: false },
                { name: 'Fees and Charges', icon: '/icons/coins-solid.svg', active: false },
                { name: 'Transactions', icon: '/icons/transaction.svg', active: false },
                { name: 'Services', icon: '/icons/galaxy.svg', active: false },
                { name: 'Service Account', icon: '/icons/user-cog.svg', active: false },
                { name: 'Settlements', icon: '/icons/scroll.svg', active: false },
                { name: 'Reports', icon: '/icons/chart-bar.svg', active: false }
            ]
        },
        {
            section: 'SETTINGS',
            items: [
                { name: 'Preferences', icon: '/icons/sliders.svg', active: false },
                { name: 'Fees and Pricing', icon: '/icons/badge-percent.svg', active: false },
                { name: 'Audit Logs', icon: '/icons/clipboard.svg', active: false },
                { name: 'Systems Messages', icon: '/icons/tire.svg', active: false }
            ]
        }
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
            <div className="sidebar-content">
                <div className="sidebar-header">
                    <div className="organization-switch">
                        <img src="/icons/briefcase.svg"
                            alt="Switch Organization"
                        />
                        <div className="dropdown-wrapper">
                            <span>Switch Organization</span>
                            <img src="/icons/angle-down.svg" alt="" />
                        </div>
                    </div>
                    {onClose && (
                        <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="nav-section">
                            {section.section &&
                                <h3 className="section-title">{section.section}</h3>
                            }
                            <ul className="nav-list">
                                {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="nav-item">
                                        <button
                                            className={`nav-link ${item.active ? 'nav-link--active' : ''}`}
                                        >
                                            <img src={item.icon} className="nav-icon" />
                                            <span className="nav-text">{item.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Logout and Version Section */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={onLogout}>
                        <img src="/icons/sign-out.svg" alt="Logout" className="logout-icon" />
                        <span>Logout</span>
                    </button>
                    <div className="version-info">
                        <span>v1.2.0</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
