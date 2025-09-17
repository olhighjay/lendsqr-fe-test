import React from 'react';
import { User } from '../../../data/mockUsers';

interface UserDetailsHeaderProps {
    user: User;
    onBack: () => void;
    onBlacklist: () => void;
    onActivate: () => void;
}

const UserDetailsHeader: React.FC<UserDetailsHeaderProps> = ({
    user,
    onBack,
    onBlacklist,
    onActivate
}) => {
    const shouldShowBlacklist = user.status !== 'blacklisted';
    const shouldShowActivate = user.status !== 'active';

    return (
        <>
            <div className="back-link" onClick={onBack}>
                <span className="back-arrow">←</span>
                <span>Back to Users</span>
            </div>

            <div className="user-details-header">
                <div className="header-left">
                    <h1 className="page-title">User Details</h1>
                </div>
                <div className="header-right">
                    {shouldShowBlacklist && (
                        <button
                            className="btn-blacklist"
                            onClick={onBlacklist}
                        >
                            BLACKLIST USER
                        </button>
                    )}
                    {shouldShowActivate && (
                        <button
                            className="btn-activate"
                            onClick={onActivate}
                        >
                            ACTIVATE USER
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserDetailsHeader;
