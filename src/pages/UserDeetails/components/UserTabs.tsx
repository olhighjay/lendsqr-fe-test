import React from 'react';

interface Tab {
    id: string;
    label: string;
}

interface UserTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const UserTabs: React.FC<UserTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="tabs-section">
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserTabs;
