import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock localStorage
export const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

// Mock window.matchMedia
export const mockMatchMedia = (matches: boolean = false) => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
};

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
    global.IntersectionObserver = class IntersectionObserver {
        root = null;
        rootMargin = '';
        thresholds = [];

        constructor() { }
        disconnect() { }
        observe() { }
        unobserve() { }
        takeRecords() { return []; }
    } as any;
};

// Mock console methods
export const mockConsole = () => {
    global.console = {
        ...console,
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
    };
};

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    );
};

const customRender = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock user data
export const mockUser = {
    id: 'user_1',
    organization: 'Lendsqr',
    username: 'john_doe',
    email: 'john@example.com',
    phoneNumber: '+2348012345678',
    dateJoined: '2023-01-15',
    status: 'active' as const,
    tier: 2,
    personalInfo: {
        fullName: 'John Doe',
        phoneNumber: '+2348012345678',
        email: 'john@example.com',
        bvn: '12345678901',
        gender: 'Male' as const,
        maritalStatus: 'Single' as const,
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

// Mock users array
export const mockUsers = [
    mockUser,
    {
        ...mockUser,
        id: 'user_2',
        username: 'jane_smith',
        email: 'jane@example.com',
        status: 'inactive' as const,
        tier: 1,
        personalInfo: {
            ...mockUser.personalInfo,
            fullName: 'Jane Smith',
            email: 'jane@example.com',
            gender: 'Female' as const,
            maritalStatus: 'Married' as const,
            children: '2'
        }
    }
];

// Mock pagination
export const mockPagination = {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1
};

// Mock API responses
export const mockApiResponses = {
    users: {
        users: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
    },
    user: mockUser,
    stats: {
        total: 2,
        active: 1,
        inactive: 1,
        pending: 0,
        blacklisted: 0
    },
    organizations: ['Lendsqr', 'TechCorp'],
    statuses: ['active', 'inactive']
};

// Helper functions
export const waitForLoadingToFinish = () => {
    return new Promise(resolve => setTimeout(resolve, 0));
};

export const createMockEvent = (value: string) => ({
    target: { value }
});

export const createMockFormEvent = (preventDefault = jest.fn()) => ({
    preventDefault
});

// Setup function for tests
export const setupTest = () => {
    Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
    });

    mockMatchMedia();
    mockIntersectionObserver();
    mockConsole();

    return {
        mockLocalStorage,
        mockUser,
        mockUsers,
        mockPagination,
        mockApiResponses
    };
};

// Cleanup function for tests
export const cleanupTest = () => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { customRender as render };
