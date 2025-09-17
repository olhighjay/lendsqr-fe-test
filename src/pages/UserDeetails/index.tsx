import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { userApiService } from '../../services/userApi';
import { localStorageService } from '../../services/localStorageService';
import { User } from '../../data/mockUsers';
import { UserDetailsHeader, UserSummaryCard, GeneralDetailsTab, OtherTabs } from './components';
import './style.scss';

interface UserDetails {
    id: string;
    userId: string;
    lastViewed: string;
    viewCount: number;
    notes?: string;
    tags?: string[];
    isFavorite: boolean;
    user: User;
}

const UserDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [user, setUser] = useState<User | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [viewCount, setViewCount] = useState(0);

    // Load user data
    useEffect(() => {
        const loadUserData = async () => {
            if (!id) {
                setError('User ID not provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                let userData = await localStorageService.getUser(id);
                let userDetailsData = await localStorageService.getUserDetails(id);

                if (!userData) {
                    userData = await userApiService.getUserById(id);
                    if (!userData) {
                        setError('User not found');
                        setLoading(false);
                        return;
                    }
                    await localStorageService.storeUserDetails(userData);
                }

                if (userDetailsData) {
                    setUserDetails(userDetailsData);
                    setNotes(userDetailsData.notes || '');
                    setTags(userDetailsData.tags || []);
                    setIsFavorite(userDetailsData.isFavorite);
                    setViewCount(userDetailsData.viewCount);
                } else {
                    await localStorageService.storeUserDetails(userData);
                    setViewCount(1);
                }

                setUser(userData);
            } catch (err) {
                console.error('Failed to load user:', err);
                setError('Failed to load user details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [id]);

    // Handle back navigation
    const handleBack = () => {
        navigate('/users');
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="user-details">
                    <div className="loading">Loading user details...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !user) {
        return (
            <DashboardLayout>
                <div className="user-details">
                    <div className="error">{error || 'User not found'}</div>
                    <button onClick={handleBack} className="back-link">
                        ← Back to Users
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const tabs = [
        { id: 'general', label: 'General Details' },
        { id: 'documents', label: 'Documents' },
        { id: 'bank', label: 'Bank Details' },
        { id: 'loans', label: 'Loans' },
        { id: 'savings', label: 'Savings' },
        { id: 'app', label: 'App and System' }
    ];


    return (
        <DashboardLayout>
            <div className="user-details">
                <UserDetailsHeader
                    user={user}
                    onBack={handleBack}
                    // onBlacklist={handleBlacklist}
                    // onActivate={handleActivate}
                />

                <UserSummaryCard
                    user={user}
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <div className="tab-content">
                    {activeTab === 'general' && <GeneralDetailsTab user={user} />}
                    {activeTab !== 'general' && <OtherTabs tabId={activeTab} />}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDetails;