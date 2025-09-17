import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatsCards from '../../components/StatsCards';
import UsersTable from '../../components/UsersTable';
import { userApiService, UserListResponse, UserFilters } from '../../services/userApi';
import { User } from '../../data/mockUsers';
import './style.scss';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [filters, setFilters] = useState<UserFilters>({});
    const [searchQuery, setSearchQuery] = useState('');

    // Load users data
    const loadUsers = async (page: number = 1, search: string = '', newFilters: UserFilters = {}, limit?: number) => {
        try {
            setLoading(true);
            setError(null);

            const response: UserListResponse = await userApiService.getUsers({
                page,
                limit: limit || pagination.limit,
                search,
                filters: newFilters,
                sortBy: 'dateJoined',
                sortOrder: 'desc'
            });

            setUsers(response.users);
            setPagination({
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.totalPages
            });
        } catch (err) {
            console.error('Failed to load users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load users on component mount
    useEffect(() => {
        loadUsers();
    }, []);

    // Handle user click
    const handleUserClick = (userId: string) => {
        navigate(`/users/${userId}`);
    };

    // Handle search
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        loadUsers(1, query, filters);
    };

    // Handle filter change
    const handleFilterChange = (newFilters: UserFilters) => {
        setFilters(newFilters);
        loadUsers(1, searchQuery, newFilters);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        loadUsers(page, searchQuery, filters);
    };

    // Handle limit change
    const handleLimitChange = (limit: number) => {
        loadUsers(1, searchQuery, filters, limit); // Reset to page 1 with new limit
    };

    // Handle refresh
    const handleRefresh = () => {
        loadUsers(pagination.page, searchQuery, filters);
    };

    // Handle user status change
    const handleUserStatusChange = async (userId: string, status: 'active' | 'inactive' | 'pending' | 'blacklisted') => {
        try {
            // Update the user status in the API
            await userApiService.updateUserStatus(userId, status);

            // Update the local state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId
                        ? { ...user, status }
                        : user
                )
            );
        } catch (error) {
            console.error('Failed to update user status:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="page-header">
                <h1 className="page-title">Users</h1>
            </div>

            <StatsCards />
            <UsersTable
                users={users}
                loading={loading}
                error={error}
                pagination={pagination}
                onUserClick={handleUserClick}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                onRefresh={handleRefresh}
                onUserStatusChange={handleUserStatusChange}
            />
        </DashboardLayout>
    );
};

export default Users;