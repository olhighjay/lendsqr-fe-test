import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserDetails from '../index';
import { User } from '../../../data/mockUsers';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'user_1' })
}));

// Mock services
jest.mock('../../../services/userApi', () => ({
    userApiService: {
        getUserById: jest.fn()
    }
}));

jest.mock('../../../services/localStorageService', () => ({
    localStorageService: {
        getUser: jest.fn(),
        getUserDetails: jest.fn(),
        storeUserDetails: jest.fn()
    }
}));

const mockUser: User = {
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
};

const renderUserDetails = () => {
    return render(
        <BrowserRouter>
            <UserDetails />
        </BrowserRouter>
    );
};

describe('UserDetails Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Loading State', () => {
        it('should show loading state initially (positive scenario)', () => {
            const { userApiService } = require('../../../services/userApi');
            const { localStorageService } = require('../../../services/localStorageService');

            userApiService.getUserById.mockResolvedValue(null);
            localStorageService.getUser.mockResolvedValue(null);
            localStorageService.getUserDetails.mockResolvedValue(null);

            renderUserDetails();

            expect(screen.getByText('Loading user details...')).toBeInTheDocument();
        });
    });

    describe('User Data Loading', () => {
        it('should load user from localStorage (positive scenario)', async () => {
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockResolvedValue(mockUser);
            localStorageService.getUserDetails.mockResolvedValue(null);
            localStorageService.storeUserDetails.mockResolvedValue(undefined);

            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('User Details')).toBeInTheDocument();
                expect(screen.getByText('John Doe')).toBeInTheDocument();
            });
        });

        it('should load user from API when not in localStorage (positive scenario)', async () => {
            const { userApiService } = require('../../../services/userApi');
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockResolvedValue(null);
            localStorageService.getUserDetails.mockResolvedValue(null);
            userApiService.getUserById.mockResolvedValue(mockUser);
            localStorageService.storeUserDetails.mockResolvedValue(undefined);

            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('User Details')).toBeInTheDocument();
                expect(screen.getByText('John Doe')).toBeInTheDocument();
                expect(userApiService.getUserById).toHaveBeenCalledWith('user_1');
            });
        });

        it('should show error when user not found (negative scenario)', async () => {
            const { userApiService } = require('../../../services/userApi');
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockResolvedValue(null);
            localStorageService.getUserDetails.mockResolvedValue(null);
            userApiService.getUserById.mockResolvedValue(null);

            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('User not found')).toBeInTheDocument();
                expect(screen.getByText('← Back to Users')).toBeInTheDocument();
            });
        });

        it('should handle API errors (negative scenario)', async () => {
            const { userApiService } = require('../../../services/userApi');
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockResolvedValue(null);
            localStorageService.getUserDetails.mockResolvedValue(null);
            userApiService.getUserById.mockRejectedValue(new Error('API Error'));

            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('Failed to load user details. Please try again.')).toBeInTheDocument();
            });
        });
    });

    describe('User Information Display', () => {
        beforeEach(async () => {
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockResolvedValue(mockUser);
            localStorageService.getUserDetails.mockResolvedValue(null);
            localStorageService.storeUserDetails.mockResolvedValue(undefined);
        });

        it('should display user basic information (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('John Doe')).toBeInTheDocument();
                expect(screen.getByText('user_1')).toBeInTheDocument();
                expect(screen.getByText('₦50,000')).toBeInTheDocument();
                expect(screen.getByText('1234567890/Access Bank')).toBeInTheDocument();
            });
        });

        it('should display user tier with stars (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('User\'s Tier')).toBeInTheDocument();
                // Check for star elements (assuming they're rendered as ★)
                const stars = screen.getAllByText('★');
                expect(stars).toHaveLength(3); // 3 stars total
            });
        });

        it('should display personal information (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('Personal Information')).toBeInTheDocument();
                expect(screen.getByText('John Doe')).toBeInTheDocument();
                expect(screen.getByText('+2348012345678')).toBeInTheDocument();
                expect(screen.getByText('john@example.com')).toBeInTheDocument();
                expect(screen.getByText('12345678901')).toBeInTheDocument();
                expect(screen.getByText('Male')).toBeInTheDocument();
                expect(screen.getByText('Single')).toBeInTheDocument();
                expect(screen.getByText('None')).toBeInTheDocument();
                expect(screen.getByText('Own Apartment')).toBeInTheDocument();
            });
        });

        it('should display education and employment (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('Education and Employment')).toBeInTheDocument();
                expect(screen.getByText('B.Sc')).toBeInTheDocument();
                expect(screen.getByText('Employed')).toBeInTheDocument();
                expect(screen.getByText('Technology')).toBeInTheDocument();
                expect(screen.getByText('3 years')).toBeInTheDocument();
                expect(screen.getByText('john.office@example.com')).toBeInTheDocument();
                expect(screen.getByText('₦150,000')).toBeInTheDocument();
                expect(screen.getByText('₦25,000')).toBeInTheDocument();
            });
        });

        it('should display social media links (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('Socials')).toBeInTheDocument();
                expect(screen.getByText('@john_doe')).toBeInTheDocument();
                expect(screen.getByText('John Doe')).toBeInTheDocument();
            });
        });

        it('should display guarantor information (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('Guarantor')).toBeInTheDocument();
                expect(screen.getByText('Jane Doe')).toBeInTheDocument();
                expect(screen.getByText('+2348012345679')).toBeInTheDocument();
                expect(screen.getByText('jane@example.com')).toBeInTheDocument();
                expect(screen.getByText('Sibling')).toBeInTheDocument();
            });
        });
    });

    describe('Tab Navigation', () => {
        beforeEach(async () => {
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockResolvedValue(mockUser);
            localStorageService.getUserDetails.mockResolvedValue(null);
            localStorageService.storeUserDetails.mockResolvedValue(undefined);
        });

        it('should switch between tabs (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('General Details')).toBeInTheDocument();
                expect(screen.getByText('Documents')).toBeInTheDocument();
                expect(screen.getByText('Bank Details')).toBeInTheDocument();
                expect(screen.getByText('Loans')).toBeInTheDocument();
                expect(screen.getByText('Savings')).toBeInTheDocument();
                expect(screen.getByText('App and System')).toBeInTheDocument();
            });

            const documentsTab = screen.getByText('Documents');
            fireEvent.click(documentsTab);

            // Should show placeholder for other tabs
            expect(screen.getByText('Documents content coming soon...')).toBeInTheDocument();
        });

        it('should show general details by default (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('Personal Information')).toBeInTheDocument();
                expect(screen.getByText('Education and Employment')).toBeInTheDocument();
                expect(screen.getByText('Socials')).toBeInTheDocument();
                expect(screen.getByText('Guarantor')).toBeInTheDocument();
            });
        });
    });

    describe('Action Buttons', () => {
        beforeEach(async () => {
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockResolvedValue(mockUser);
            localStorageService.getUserDetails.mockResolvedValue(null);
            localStorageService.storeUserDetails.mockResolvedValue(undefined);
        });

        it('should show blacklist button for active user (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('BLACKLIST USER')).toBeInTheDocument();
                expect(screen.getByText('ACTIVATE USER')).toBeInTheDocument();
            });
        });

        it('should show activate button for inactive user (positive scenario)', async () => {
            const inactiveUser = { ...mockUser, status: 'inactive' as const };
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockResolvedValue(inactiveUser);
            localStorageService.getUserDetails.mockResolvedValue(null);
            localStorageService.storeUserDetails.mockResolvedValue(undefined);

            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('BLACKLIST USER')).toBeInTheDocument();
                expect(screen.getByText('ACTIVATE USER')).toBeInTheDocument();
            });
        });

        it('should handle blacklist action (positive scenario)', async () => {
            const { userApiService } = require('../../../services/userApi');
            userApiService.updateUserStatus.mockResolvedValue({ ...mockUser, status: 'blacklisted' });

            renderUserDetails();

            await waitFor(() => {
                const blacklistButton = screen.getByText('BLACKLIST USER');
                fireEvent.click(blacklistButton);
            });

            expect(userApiService.updateUserStatus).toHaveBeenCalledWith('user_1', 'blacklisted');
        });

        it('should handle activate action (positive scenario)', async () => {
            const { userApiService } = require('../../../services/userApi');
            userApiService.updateUserStatus.mockResolvedValue({ ...mockUser, status: 'active' });

            renderUserDetails();

            await waitFor(() => {
                const activateButton = screen.getByText('ACTIVATE USER');
                fireEvent.click(activateButton);
            });

            expect(userApiService.updateUserStatus).toHaveBeenCalledWith('user_1', 'active');
        });

        it('should handle action errors (negative scenario)', async () => {
            const { userApiService } = require('../../../services/userApi');
            userApiService.updateUserStatus.mockRejectedValue(new Error('Action failed'));

            // Mock window.alert
            window.alert = jest.fn();

            renderUserDetails();

            await waitFor(() => {
                const blacklistButton = screen.getByText('BLACKLIST USER');
                fireEvent.click(blacklistButton);
            });

            expect(window.alert).toHaveBeenCalledWith('Failed to blacklist user. Please try again.');
        });
    });

    describe('Navigation', () => {
        beforeEach(async () => {
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockResolvedValue(mockUser);
            localStorageService.getUserDetails.mockResolvedValue(null);
            localStorageService.storeUserDetails.mockResolvedValue(undefined);
        });

        it('should navigate back to users page (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                const backButton = screen.getByText('← Back to Users');
                fireEvent.click(backButton);
            });

            expect(mockNavigate).toHaveBeenCalledWith('/users');
        });
    });

    describe('Error Handling', () => {
        it('should handle missing user ID (negative scenario)', () => {
            // Mock useParams to return undefined id
            jest.doMock('react-router-dom', () => ({
                ...jest.requireActual('react-router-dom'),
                useNavigate: () => mockNavigate,
                useParams: () => ({ id: undefined })
            }));

            renderUserDetails();

            expect(screen.getByText('User ID not provided')).toBeInTheDocument();
        });

        it('should handle localStorage errors (negative scenario)', async () => {
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockRejectedValue(new Error('Storage error'));
            localStorageService.getUserDetails.mockRejectedValue(new Error('Storage error'));

            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByText('Failed to load user details. Please try again.')).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        beforeEach(async () => {
            const { localStorageService } = require('../../../services/localStorageService');

            localStorageService.getUser.mockResolvedValue(mockUser);
            localStorageService.getUserDetails.mockResolvedValue(null);
            localStorageService.storeUserDetails.mockResolvedValue(undefined);
        });

        it('should have proper heading structure (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'User Details' })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Personal Information' })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Education and Employment' })).toBeInTheDocument();
            });
        });

        it('should have proper button roles (positive scenario)', async () => {
            renderUserDetails();

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'BLACKLIST USER' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'ACTIVATE USER' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: '← Back to Users' })).toBeInTheDocument();
            });
        });
    });
});
