import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../data/mockUsers';
import { UserFilters } from '../../services/userApi';
import './style.scss';

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface UsersTableProps {
    users: User[];
    loading: boolean;
    error: string | null;
    pagination: Pagination;
    onUserClick?: (userId: string) => void;
    onSearch?: (query: string) => void;
    onFilterChange?: (filters: UserFilters) => void;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    onRefresh?: () => void;
    onUserStatusChange?: (userId: string, status: 'active' | 'inactive' | 'pending' | 'blacklisted') => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
    users,
    loading,
    error,
    pagination,
    onUserClick,
    onSearch,
    onFilterChange,
    onPageChange,
    onLimitChange,
    onRefresh,
    onUserStatusChange
}) => {
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [showActionPopup, setShowActionPopup] = useState<string | null>(null);
    const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
    const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<UserFilters>({});
    const [filterForm, setFilterForm] = useState<UserFilters>({});
    const filterRef = useRef<HTMLDivElement>(null);
    const actionRef = useRef<HTMLDivElement>(null);

    const getStatusClass = (status: string) => {
        return `status-badge status-badge--${status.toLowerCase()}`;
    };

    // Check if any filters are active
    const hasActiveFilters = () => {
        return Object.values(filters).some(value => value && value.trim() !== '');
    };

    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) {
            onSearch(query);
        }
    };

    // Handle filter change
    const handleFilterChange = (newFilters: UserFilters) => {
        setFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    // Handle filter form input changes
    const handleFilterInputChange = (field: keyof UserFilters, value: string) => {
        setFilterForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle filter apply
    const handleFilterApply = () => {
        const newFilters = { ...filterForm };
        setFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
        setShowFilterPopup(false);
    };

    // Handle filter reset
    const handleFilterReset = () => {
        setFilterForm({});
        setFilters({});
        if (onFilterChange) {
            onFilterChange({});
        }
        setShowFilterPopup(false);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        }
    };

    // Handle filter popup - always position below first header
    const handleFilterClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        // Find the table and first header
        const table = event.currentTarget.closest('table');
        const firstHeader = table?.querySelector('th .sort-icon');

        if (table && firstHeader) {
            const tableRect = table.getBoundingClientRect();
            const headerRect = firstHeader.getBoundingClientRect();
            setFilterPosition({
                top: headerRect.bottom + window.scrollY - 85, // Reduced gap by 5px
                left: tableRect.left + window.scrollX // Start exactly where table starts
            });
        }
        setShowFilterPopup(true);
        setShowActionPopup(null);
    };

    // Handle action popup
    const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, userId: string) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setActionPosition({
            top: rect.bottom + window.scrollY - 97, // Reduced gap by 5px
            left: rect.left + window.scrollX - 100 // Offset to align popup
        });
        setShowActionPopup(userId);
        setShowFilterPopup(false);
    };

    // Close popups when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilterPopup(false);
            }
            if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
                setShowActionPopup(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleActionItem = (action: string, userId: string) => {
        if (action === 'View Details' && onUserClick) {
            onUserClick(userId);
        } else if (action === 'Blacklist User' && onUserStatusChange) {
            onUserStatusChange(userId, 'blacklisted');
        } else if (action === 'Activate User' && onUserStatusChange) {
            onUserStatusChange(userId, 'active');
        }
        setShowActionPopup(null);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="">
            <div className="users-table-container">
                {loading && (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading users...</p>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <p>{error}</p>
                        <button onClick={onRefresh} className="retry-btn">
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="table-wrapper">
                        {hasActiveFilters() && (
                            <div className="active-filters">
                                <span className="filters-label">Active Filters:</span>
                                <div className="filter-tags">
                                    {Object.entries(filters).map(([key, value]) =>
                                        value && value.trim() !== '' && (
                                            <span key={key} className="filter-tag">
                                                {key}: {value}
                                                <button
                                                    onClick={() => {
                                                        const newFilters = { ...filters };
                                                        delete newFilters[key as keyof UserFilters];
                                                        setFilters(newFilters);
                                                        if (onFilterChange) {
                                                            onFilterChange(newFilters);
                                                        }
                                                    }}
                                                    className="filter-tag-remove"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )
                                    )}
                                </div>
                                <button
                                    onClick={handleFilterReset}
                                    className="clear-all-filters"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th className="table-header">
                                        <div className='table-header-content'>
                                            <span>ORGANIZATION</span>
                                            <img className="sort-icon" onClick={handleFilterClick}
                                                src="/icons/filter-results-button.svg" alt="sort"
                                            />
                                        </div>
                                    </th>
                                    <th className="table-header">
                                        <div className='table-header-content'>
                                            <span>USERNAME</span>
                                            <img className="sort-icon" onClick={handleFilterClick}
                                                src="/icons/filter-results-button.svg" alt="sort" />
                                        </div>
                                    </th>
                                    <th className="table-header">
                                        <div className='table-header-content'>
                                            <span>EMAIL</span>
                                            <img className="sort-icon" onClick={handleFilterClick}
                                                src="/icons/filter-results-button.svg" alt="sort" />
                                        </div>
                                    </th>
                                    <th className="table-header">
                                        <div className='table-header-content'>
                                            <span>PHONE NUMBER</span>
                                            <img className="sort-icon" onClick={handleFilterClick}
                                                src="/icons/filter-results-button.svg" alt="sort" />
                                        </div>
                                    </th>
                                    <th className="table-header">
                                        <div className='table-header-content'>
                                            <span>DATE JOINED</span>
                                            <img className="sort-icon" onClick={handleFilterClick}
                                                src="/icons/filter-results-button.svg" alt="sort" />
                                        </div>
                                    </th>
                                    <th className="table-header">
                                        <div className='table-header-content'>
                                            <span>STATUS</span>
                                            <img
                                                className={`sort-icon ${hasActiveFilters() ? 'active' : ''}`}
                                                onClick={handleFilterClick}
                                                src="/icons/filter-results-button.svg"
                                                alt="sort"
                                            />
                                        </div>
                                    </th>
                                    <th className="table-header"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="table-row">
                                        <td className="table-cell">{user.organization}</td>
                                        <td className="table-cell">{user.username}</td>
                                        <td className="table-cell">{user.email}</td>
                                        <td className="table-cell">{user.phoneNumber}</td>
                                        <td className="table-cell">{formatDate(user.dateJoined)}</td>
                                        <td className="table-cell">
                                            <span className={getStatusClass(user.status)}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <button
                                                className="action-btn"
                                                onClick={(e) => handleActionClick(e, user.id)}
                                            >
                                                <img src='/icons/action-menu.svg' alt='more actions' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Filter Popup */}
                {showFilterPopup && (
                    <div
                        ref={filterRef}
                        className="filter-popup"
                        style={{
                            position: 'absolute',
                            top: filterPosition.top,
                            left: filterPosition.left,
                            zIndex: 1000
                        }}
                    >
                        <div className="filter-content">
                            <div className="filter-field">
                                <label>Organization</label>
                                <select
                                    className="filter-select"
                                    value={filterForm.organization || ''}
                                    onChange={(e) => handleFilterInputChange('organization', e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Lendsqr">Lendsqr</option>
                                    <option value="Irorun">Irorun</option>
                                    <option value="Lendstar">Lendstar</option>
                                    <option value="TechCorp">TechCorp</option>
                                    <option value="FinanceHub">FinanceHub</option>
                                    <option value="InnovateLab">InnovateLab</option>
                                    <option value="DataFlow">DataFlow</option>
                                    <option value="CloudSync">CloudSync</option>
                                    <option value="NextGen">NextGen</option>
                                    <option value="FutureTech">FutureTech</option>
                                </select>
                            </div>
                            <div className="filter-field">
                                <label>Username</label>
                                <input
                                    type="text"
                                    placeholder="User"
                                    className="filter-input"
                                    value={filterForm.username || ''}
                                    onChange={(e) => handleFilterInputChange('username', e.target.value)}
                                />
                            </div>
                            <div className="filter-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="filter-input"
                                    value={filterForm.email || ''}
                                    onChange={(e) => handleFilterInputChange('email', e.target.value)}
                                />
                            </div>
                            <div className="filter-field">
                                <label>Date</label>
                                <input
                                    type="date"
                                    placeholder="Date"
                                    className="filter-input"
                                    value={filterForm.dateJoined || ''}
                                    onChange={(e) => handleFilterInputChange('dateJoined', e.target.value)}
                                />
                            </div>
                            <div className="filter-field">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="filter-input"
                                    value={filterForm.phoneNumber || ''}
                                    onChange={(e) => handleFilterInputChange('phoneNumber', e.target.value)}
                                />
                            </div>
                            <div className="filter-field">
                                <label>Status</label>
                                <select
                                    className="filter-select"
                                    value={filterForm.status || ''}
                                    onChange={(e) => handleFilterInputChange('status', e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                    <option value="blacklisted">Blacklisted</option>
                                </select>
                            </div>
                            <div className="filter-actions">
                                <button className="filter-reset" onClick={handleFilterReset}>Reset</button>
                                <button className="filter-apply" onClick={handleFilterApply}>Filter</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Popup */}
                {showActionPopup && (
                    <div
                        ref={actionRef}
                        className="action-popup"
                        style={{
                            position: 'absolute',
                            top: actionPosition.top,
                            left: actionPosition.left,
                            zIndex: 1000
                        }}
                    >
                        <div className="action-content">
                            <button
                                className="action-item"
                                onClick={() => handleActionItem('View Details', showActionPopup!)}
                            >
                                <img className="action-icon" src='/icons/view.svg'
                                    width={14} height={14} alt='view details' />
                                View Details
                            </button>
                            {(() => {
                                const currentUser = users.find(user => user.id === showActionPopup);
                                if (!currentUser) return null;

                                const shouldShowBlacklist = currentUser.status !== 'blacklisted';
                                const shouldShowActivate = currentUser.status !== 'active';

                                return (
                                    <>
                                        {shouldShowBlacklist && (
                                            <button
                                                className="action-item"
                                                onClick={() => handleActionItem('Blacklist User', showActionPopup!)}
                                            >
                                                <img className="action-icon" src='/icons/blacklist.svg'
                                                    width={14} height={14} alt='blacklist user' />
                                                Blacklist User
                                            </button>
                                        )}
                                        {shouldShowActivate && (
                                            <button
                                                className="action-item"
                                                onClick={() => handleActionItem('Activate User', showActionPopup!)}
                                            >
                                                <img className="action-icon" src='/icons/activate.svg'
                                                    width={14} height={14} alt='activate user' />
                                                Activate User
                                            </button>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>
            <div className="table-footer">
                <div className="pagination-info">
                    <span>Showing</span>
                    <select
                        value={pagination.limit}
                        onChange={(e) => {
                            const newLimit = Number(e.target.value);
                            if (onLimitChange) {
                                onLimitChange(newLimit);
                            }
                        }}
                        className="items-per-page"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span>out of {pagination.total} entries</span>
                </div>

                {!loading && !error && pagination.totalPages > 1 && (
                    <div className="pagination-controls">
                        <div className="pagination-buttons">
                            <button
                                className="pagination-btn"
                                disabled={pagination.page === 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                &lt;
                            </button>

                            <div className="page-numbers">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {pagination.totalPages > 5 && (
                                    <>
                                        <span className="page-ellipsis">...</span>
                                        <button
                                            className={`page-btn ${pagination.page === pagination.totalPages ? 'active' : ''}`}
                                            onClick={() => handlePageChange(pagination.totalPages)}
                                        >
                                            {pagination.totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                className="pagination-btn"
                                disabled={pagination.page === pagination.totalPages}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersTable;
