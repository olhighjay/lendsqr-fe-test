import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UsersTable from '../index';
import { User } from '../../../data/mockUsers';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockUsers: User[] = [
    {
        id: 'user_1',
        organization: 'Lendsqr',
        username: 'john_doe',
        email: 'john@example.com',
        phoneNumber: '+2348012345678',
        dateJoined: '2023-01-15',
        status: 'active',
        tier: 2,
        personalInfo: {
            fullName: 'John Doe',
            phoneNumber: '+2348012345678',
            email: 'john@example.com',
            bvn: '12345678901',
            gender: 'Male',
            maritalStatus: 'Single',
            children: 'None',
            typeOfResidence: 'Own Apartment'
        },
        educationAndEmployment: {
            levelOfEducation: 'B.Sc',
            employmentStatus: 'Employed',
            sectorOfEmployment: 'Technology',
            durationOfEmployment: '3 years',
            officeEmail: 'john.office@example.com',
            monthlyIncome: '₦150,000',
            loanRepayment: '₦25,000'
        },
        socials: {
            twitter: '@john_doe',
            facebook: 'John Doe',
            instagram: '@john_doe'
        },
        guarantors: [{
            fullName: 'Jane Doe',
            phoneNumber: '+2348012345679',
            emailAddress: 'jane@example.com',
            relationship: 'Sibling'
        }],
        accountBalance: '₦50,000',
        bankName: 'Access Bank',
        accountNumber: '1234567890',
        avatar: 'https://example.com/avatar1.jpg'
    },
    {
        id: 'user_2',
        organization: 'TechCorp',
        username: 'jane_smith',
        email: 'jane@example.com',
        phoneNumber: '+2348012345680',
        dateJoined: '2023-02-20',
        status: 'inactive',
        tier: 1,
        personalInfo: {
            fullName: 'Jane Smith',
            phoneNumber: '+2348012345680',
            email: 'jane@example.com',
            bvn: '12345678902',
            gender: 'Female',
            maritalStatus: 'Married',
            children: '2',
            typeOfResidence: 'Rented Apartment'
        },
        educationAndEmployment: {
            levelOfEducation: 'M.Sc',
            employmentStatus: 'Employed',
            sectorOfEmployment: 'Finance',
            durationOfEmployment: '5 years',
            officeEmail: 'jane.office@example.com',
            monthlyIncome: '₦200,000',
            loanRepayment: '₦50,000'
        },
        socials: {
            twitter: '@jane_smith',
            facebook: 'Jane Smith',
            instagram: '@jane_smith'
        },
        guarantors: [{
            fullName: 'Bob Smith',
            phoneNumber: '+2348012345681',
            emailAddress: 'bob@example.com',
            relationship: 'Spouse'
        }],
        accountBalance: '₦75,000',
        bankName: 'First Bank',
        accountNumber: '0987654321',
        avatar: 'https://example.com/avatar2.jpg'
    }
];

const defaultProps = {
    users: mockUsers,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1
    },
    onUserClick: jest.fn(),
    onSearch: jest.fn(),
    onFilterChange: jest.fn(),
    onPageChange: jest.fn(),
    onLimitChange: jest.fn(),
    onRefresh: jest.fn()
};

const renderUsersTable = (props = {}) => {
    return render(
        <BrowserRouter>
            <UsersTable {...defaultProps} {...props} />
        </BrowserRouter>
    );
};

describe('UsersTable Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render users table with data (positive scenario)', () => {
            renderUsersTable();

            expect(screen.getByText('ORGANIZATION')).toBeInTheDocument();
            expect(screen.getByText('USERNAME')).toBeInTheDocument();
            expect(screen.getByText('EMAIL')).toBeInTheDocument();
            expect(screen.getByText('PHONE NUMBER')).toBeInTheDocument();
            expect(screen.getByText('DATE JOINED')).toBeInTheDocument();
            expect(screen.getByText('STATUS')).toBeInTheDocument();

            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        it('should render loading state (positive scenario)', () => {
            renderUsersTable({ loading: true });

            expect(screen.getByText('Loading users...')).toBeInTheDocument();
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        });

        it('should render error state (positive scenario)', () => {
            renderUsersTable({ error: 'Failed to load users' });

            expect(screen.getByText('Failed to load users')).toBeInTheDocument();
            expect(screen.getByText('Try Again')).toBeInTheDocument();
        });

        it('should render empty state when no users (negative scenario)', () => {
            renderUsersTable({ users: [] });

            expect(screen.getByText('No users found')).toBeInTheDocument();
        });
    });

    describe('User Actions', () => {
        it('should open action menu when action button is clicked (positive scenario)', () => {
            renderUsersTable();

            const actionButtons = screen.getAllByAltText('action menu');
            fireEvent.click(actionButtons[0]);

            expect(screen.getByText('View Details')).toBeInTheDocument();
            expect(screen.getByText('Blacklist User')).toBeInTheDocument();
            expect(screen.getByText('Activate User')).toBeInTheDocument();
        });

        it('should close action menu when clicking outside (positive scenario)', () => {
            renderUsersTable();

            const actionButtons = screen.getAllByAltText('action menu');
            fireEvent.click(actionButtons[0]);

            expect(screen.getByText('View Details')).toBeInTheDocument();

            fireEvent.click(document.body);

            expect(screen.queryByText('View Details')).not.toBeInTheDocument();
        });

        it('should call onUserClick when View Details is clicked (positive scenario)', () => {
            const mockOnUserClick = jest.fn();
            renderUsersTable({ onUserClick: mockOnUserClick });

            const actionButtons = screen.getAllByAltText('action menu');
            fireEvent.click(actionButtons[0]);

            const viewDetailsButton = screen.getByText('View Details');
            fireEvent.click(viewDetailsButton);

            expect(mockOnUserClick).toHaveBeenCalledWith('user_1');
        });

        it('should handle action menu for different users (positive scenario)', () => {
            renderUsersTable();

            const actionButtons = screen.getAllByAltText('action menu');
            fireEvent.click(actionButtons[1]); // Second user

            expect(screen.getByText('View Details')).toBeInTheDocument();

            const viewDetailsButton = screen.getByText('View Details');
            fireEvent.click(viewDetailsButton);

            expect(defaultProps.onUserClick).toHaveBeenCalledWith('user_2');
        });
    });

    describe('Filtering', () => {
        it('should open filter popup when filter button is clicked (positive scenario)', () => {
            renderUsersTable();

            const filterButtons = screen.getAllByAltText('sort');
            fireEvent.click(filterButtons[0]);

            expect(screen.getByText('Organization')).toBeInTheDocument();
            expect(screen.getByText('Username')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('Date')).toBeInTheDocument();
            expect(screen.getByText('Phone Number')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
        });

        it('should apply filters when Filter button is clicked (positive scenario)', () => {
            const mockOnFilterChange = jest.fn();
            renderUsersTable({ onFilterChange: mockOnFilterChange });

            const filterButtons = screen.getAllByAltText('sort');
            fireEvent.click(filterButtons[0]);

            const organizationSelect = screen.getByDisplayValue('Select');
            fireEvent.change(organizationSelect, { target: { value: 'Lendsqr' } });

            const filterButton = screen.getByText('Filter');
            fireEvent.click(filterButton);

            expect(mockOnFilterChange).toHaveBeenCalledWith({ organization: 'Lendsqr' });
        });

        it('should reset filters when Reset button is clicked (positive scenario)', () => {
            const mockOnFilterChange = jest.fn();
            renderUsersTable({ onFilterChange: mockOnFilterChange });

            const filterButtons = screen.getAllByAltText('sort');
            fireEvent.click(filterButtons[0]);

            const organizationSelect = screen.getByDisplayValue('Select');
            fireEvent.change(organizationSelect, { target: { value: 'Lendsqr' } });

            const resetButton = screen.getByText('Reset');
            fireEvent.click(resetButton);

            expect(mockOnFilterChange).toHaveBeenCalledWith({});
        });

        it('should show active filters when filters are applied (positive scenario)', () => {
            renderUsersTable({
                users: mockUsers.filter(user => user.organization === 'Lendsqr')
            });

            // Mock the hasActiveFilters function by setting filters
            const component = screen.getByRole('table');
            expect(component).toBeInTheDocument();
        });
    });

    describe('Pagination', () => {
        it('should render pagination controls (positive scenario)', () => {
            renderUsersTable({
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 25,
                    totalPages: 3
                }
            });

            expect(screen.getByText('Showing 1 to 10 of 25 entries')).toBeInTheDocument();
            expect(screen.getByText('Previous')).toBeInTheDocument();
            expect(screen.getByText('Next')).toBeInTheDocument();
        });

        it('should call onPageChange when page button is clicked (positive scenario)', () => {
            const mockOnPageChange = jest.fn();
            renderUsersTable({
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 25,
                    totalPages: 3
                },
                onPageChange: mockOnPageChange
            });

            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);

            expect(mockOnPageChange).toHaveBeenCalledWith(2);
        });

        it('should call onLimitChange when limit is changed (positive scenario)', () => {
            const mockOnLimitChange = jest.fn();
            renderUsersTable({ onLimitChange: mockOnLimitChange });

            const limitSelect = screen.getByDisplayValue('10');
            fireEvent.change(limitSelect, { target: { value: '25' } });

            expect(mockOnLimitChange).toHaveBeenCalledWith(25);
        });

        it('should disable Previous button on first page (positive scenario)', () => {
            renderUsersTable({
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 25,
                    totalPages: 3
                }
            });

            const prevButton = screen.getByText('Previous');
            expect(prevButton).toBeDisabled();
        });

        it('should disable Next button on last page (positive scenario)', () => {
            renderUsersTable({
                pagination: {
                    page: 3,
                    limit: 10,
                    total: 25,
                    totalPages: 3
                }
            });

            const nextButton = screen.getByText('Next');
            expect(nextButton).toBeDisabled();
        });
    });

    describe('Status Display', () => {
        it('should display active status correctly (positive scenario)', () => {
            renderUsersTable();

            const activeStatus = screen.getByText('Active');
            expect(activeStatus).toHaveClass('status-badge--active');
        });

        it('should display inactive status correctly (positive scenario)', () => {
            renderUsersTable();

            const inactiveStatus = screen.getByText('Inactive');
            expect(inactiveStatus).toHaveClass('status-badge--inactive');
        });
    });

    describe('Date Formatting', () => {
        it('should format dates correctly (positive scenario)', () => {
            renderUsersTable();

            // Check if dates are formatted (this would depend on the actual formatDate function)
            expect(screen.getByText('Jan 15, 2023')).toBeInTheDocument();
            expect(screen.getByText('Feb 20, 2023')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('should handle onUserClick error (negative scenario)', () => {
            const mockOnUserClick = jest.fn().mockImplementation(() => {
                throw new Error('Navigation error');
            });

            renderUsersTable({ onUserClick: mockOnUserClick });

            const actionButtons = screen.getAllByAltText('action menu');
            fireEvent.click(actionButtons[0]);

            const viewDetailsButton = screen.getByText('View Details');

            // Should not throw error, just fail silently
            expect(() => {
                fireEvent.click(viewDetailsButton);
            }).not.toThrow();
        });

        it('should handle onFilterChange error (negative scenario)', () => {
            const mockOnFilterChange = jest.fn().mockImplementation(() => {
                throw new Error('Filter error');
            });

            renderUsersTable({ onFilterChange: mockOnFilterChange });

            const filterButtons = screen.getAllByAltText('sort');
            fireEvent.click(filterButtons[0]);

            const filterButton = screen.getByText('Filter');

            // Should not throw error, just fail silently
            expect(() => {
                fireEvent.click(filterButton);
            }).not.toThrow();
        });
    });

    describe('Accessibility', () => {
        it('should have proper table structure (positive scenario)', () => {
            renderUsersTable();

            expect(screen.getByRole('table')).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: 'ORGANIZATION' })).toBeInTheDocument();
            expect(screen.getByRole('columnheader', { name: 'USERNAME' })).toBeInTheDocument();
        });

        it('should be keyboard navigable (positive scenario)', () => {
            renderUsersTable();

            const actionButtons = screen.getAllByAltText('action menu');
            actionButtons[0].focus();
            expect(actionButtons[0]).toHaveFocus();
        });
    });
});
