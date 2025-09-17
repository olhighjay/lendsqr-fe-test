import React from 'react';
import { User } from '../../../data/mockUsers';

interface Tab {
    id: string;
    label: string;
}

interface UserSummaryCardProps {
    user: User;
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const UserSummaryCard: React.FC<UserSummaryCardProps> = ({ user, tabs, activeTab, onTabChange }) => {
    const renderStars = (filled: number) => {
        return Array.from({ length: 3 }, (_, index) => (
            <span key={index} className={`star ${index < filled ? 'filled' : ''}`}>
                ★
            </span>
        ));
    };

    return (
        <div className="user-profile-card">
            <div className="user-summary-section">
                <div className="profile-section">
                    <div>
                        <img
                            src={user.avatar}
                            width={100}
                            height={100}
                            alt="User Avatar"
                            onError={(e) => {
                                e.currentTarget.src = '/images/user-details-avatar.png';
                            }}
                        />
                    </div>

                    <div className="profile-info">
                        <div className="profile-info-content bordered">
                            <h2 className="user-name">{user.personalInfo.fullName}</h2>
                            <p className="user-id">{user.id}</p>
                        </div>
                        <div className="profile-info-content tier bordered">
                            <span className="tier-label">User's Tier</span>
                            <div className="stars">
                                {renderStars(user.tier)}
                            </div>
                        </div>
                        <div className="profile-info-content tier">
                            <span className="financial-label">{user.accountBalance}</span>
                            <div className="stars">
                                <span className="financial-label fin-desc">{user.accountNumber}/{user.bankName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
        </div>
    );
};

export default UserSummaryCard;
