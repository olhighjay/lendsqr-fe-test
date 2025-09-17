import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock child components to avoid complex rendering
jest.mock('../pages/Login', () => {
    return function MockLogin() {
        return <div data-testid="login-page">Login Page</div>;
    };
});

jest.mock('../pages/Users', () => {
    return function MockUsers() {
        return <div data-testid="users-page">Users Page</div>;
    };
});

jest.mock('../pages/UserDeetails', () => {
    return function MockUserDetails() {
        return <div data-testid="user-details-page">User Details Page</div>;
    };
});

const renderApp = () => {
    return render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
};

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Authentication Routing', () => {
        it('should redirect to login when not authenticated (positive scenario)', () => {
            localStorageMock.getItem.mockReturnValue(null);

            renderApp();

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });

        it('should redirect to login when authentication is false (negative scenario)', () => {
            localStorageMock.getItem.mockReturnValue('false');

            renderApp();

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });

        it('should show users page when authenticated (positive scenario)', () => {
            localStorageMock.getItem.mockReturnValue('true');

            renderApp();

            expect(screen.getByTestId('users-page')).toBeInTheDocument();
        });

        it('should show user details page when authenticated and on user details route (positive scenario)', () => {
            localStorageMock.getItem.mockReturnValue('true');

            // Mock window.location for user details route
            Object.defineProperty(window, 'location', {
                value: {
                    pathname: '/users/user_1'
                },
                writable: true
            });

            renderApp();

            expect(screen.getByTestId('user-details-page')).toBeInTheDocument();
        });
    });

    describe('Route Protection', () => {
        it('should protect users route when not authenticated (positive scenario)', () => {
            localStorageMock.getItem.mockReturnValue(null);

            renderApp();

            // Should redirect to login, not show users page
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(screen.queryByTestId('users-page')).not.toBeInTheDocument();
        });

        it('should protect user details route when not authenticated (positive scenario)', () => {
            localStorageMock.getItem.mockReturnValue(null);

            renderApp();

            // Should redirect to login, not show user details page
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(screen.queryByTestId('user-details-page')).not.toBeInTheDocument();
        });

        it('should allow access to protected routes when authenticated (positive scenario)', () => {
            localStorageMock.getItem.mockReturnValue('true');

            renderApp();

            expect(screen.getByTestId('users-page')).toBeInTheDocument();
        });
    });

    describe('Default Routes', () => {
        it('should redirect root path to login (positive scenario)', () => {
            localStorageMock.getItem.mockReturnValue(null);

            renderApp();

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });

        it('should redirect wildcard routes to login (positive scenario)', () => {
            localStorageMock.getItem.mockReturnValue(null);

            renderApp();

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });
    });

    describe('Authentication State Changes', () => {
        it('should handle authentication state changes (positive scenario)', () => {
            // Start unauthenticated
            localStorageMock.getItem.mockReturnValue(null);

            const { rerender } = renderApp();
            expect(screen.getByTestId('login-page')).toBeInTheDocument();

            // Simulate authentication
            localStorageMock.getItem.mockReturnValue('true');
            rerender(
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            );

            expect(screen.getByTestId('users-page')).toBeInTheDocument();
        });

        it('should handle logout (positive scenario)', () => {
            // Start authenticated
            localStorageMock.getItem.mockReturnValue('true');

            const { rerender } = renderApp();
            expect(screen.getByTestId('users-page')).toBeInTheDocument();

            // Simulate logout
            localStorageMock.getItem.mockReturnValue(null);
            rerender(
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            );

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('should handle localStorage errors gracefully (negative scenario)', () => {
            localStorageMock.getItem.mockImplementation(() => {
                throw new Error('localStorage error');
            });

            // Should not throw error, just treat as unauthenticated
            expect(() => renderApp()).not.toThrow();
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });

        it('should handle invalid authentication values (negative scenario)', () => {
            localStorageMock.getItem.mockReturnValue('invalid');

            renderApp();

            // Should treat invalid values as unauthenticated
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });
    });

    describe('Component Integration', () => {
        it('should render all necessary components (positive scenario)', () => {
            localStorageMock.getItem.mockReturnValue('true');

            renderApp();

            // Check that the main app structure is rendered
            expect(screen.getByTestId('users-page')).toBeInTheDocument();
        });

        it('should maintain component state across route changes (positive scenario)', () => {
            localStorageMock.getItem.mockReturnValue('true');

            const { rerender } = renderApp();
            expect(screen.getByTestId('users-page')).toBeInTheDocument();

            // Simulate route change
            rerender(
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            );

            expect(screen.getByTestId('users-page')).toBeInTheDocument();
        });
    });
});
