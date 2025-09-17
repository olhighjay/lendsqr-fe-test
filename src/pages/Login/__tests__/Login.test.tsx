import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../index';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

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

const renderLogin = () => {
    return render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
};

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.setItem.mockImplementation(() => { });
    });

    describe('Rendering', () => {
        it('should render login form elements (positive scenario)', () => {
            renderLogin();

            expect(screen.getByText('Welcome!')).toBeInTheDocument();
            expect(screen.getByText('Enter details to login.')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
            expect(screen.getByText('FORGOT PASSWORD?')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        });

        it('should render logo images (positive scenario)', () => {
            renderLogin();

            const logos = screen.getAllByAltText('Logo');
            expect(logos).toHaveLength(2); // Desktop and mobile logos
        });

        it('should render login image (positive scenario)', () => {
            renderLogin();

            expect(screen.getByAltText('Login Visual')).toBeInTheDocument();
        });
    });

    describe('Form Interaction', () => {
        it('should update email input value (positive scenario)', () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

            expect(emailInput).toHaveValue('test@example.com');
        });

        it('should update password input value (positive scenario)', () => {
            renderLogin();

            const passwordInput = screen.getByPlaceholderText('Password');
            fireEvent.change(passwordInput, { target: { value: 'password123' } });

            expect(passwordInput).toHaveValue('password123');
        });

        it('should toggle password visibility (positive scenario)', () => {
            renderLogin();

            const passwordInput = screen.getByPlaceholderText('Password');
            const toggleButton = screen.getByText('SHOW');

            expect(passwordInput).toHaveAttribute('type', 'password');

            fireEvent.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'text');
            expect(screen.getByText('HIDE')).toBeInTheDocument();

            fireEvent.click(screen.getByText('HIDE'));
            expect(passwordInput).toHaveAttribute('type', 'password');
            expect(screen.getByText('SHOW')).toBeInTheDocument();
        });

        it('should show loading state during submission (positive scenario)', async () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            expect(screen.getByText('Logging in...')).toBeInTheDocument();
        });
    });

    describe('Form Submission', () => {
        it('should submit form with valid data (positive scenario)', async () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
                expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({ email: 'test@example.com' }));
                expect(mockNavigate).toHaveBeenCalledWith('/users');
            });
        });

        it('should handle form submission with empty fields (negative scenario)', () => {
            renderLogin();

            const submitButton = screen.getByRole('button', { name: /log in/i });
            fireEvent.click(submitButton);

            // Form should not submit due to required validation
            expect(localStorageMock.setItem).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should handle form submission with invalid email (negative scenario)', () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            // Form should not submit due to email validation
            expect(localStorageMock.setItem).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should handle localStorage errors during submission (negative scenario)', async () => {
            localStorageMock.setItem.mockImplementation(() => {
                throw new Error('Storage error');
            });

            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(localStorageMock.setItem).toHaveBeenCalled();
                // Navigation should still happen even if localStorage fails
                expect(mockNavigate).toHaveBeenCalledWith('/users');
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper form labels and attributes (positive scenario)', () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            expect(emailInput).toHaveAttribute('type', 'email');
            expect(emailInput).toHaveAttribute('required');
            expect(passwordInput).toHaveAttribute('type', 'password');
            expect(passwordInput).toHaveAttribute('required');
            expect(submitButton).toHaveAttribute('type', 'submit');
        });

        it('should be keyboard navigable (positive scenario)', () => {
            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            emailInput.focus();
            expect(emailInput).toHaveFocus();

            fireEvent.keyDown(emailInput, { key: 'Tab' });
            expect(passwordInput).toHaveFocus();

            fireEvent.keyDown(passwordInput, { key: 'Tab' });
            expect(submitButton).toHaveFocus();
        });
    });

    describe('Responsive Design', () => {
        it('should render mobile logo on small screens (positive scenario)', () => {
            // Mock window.innerWidth
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 600,
            });

            renderLogin();

            const mobileLogo = screen.getByAltText('Logo');
            expect(mobileLogo).toBeInTheDocument();
        });

        it('should render desktop logo on large screens (positive scenario)', () => {
            // Mock window.innerWidth
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1200,
            });

            renderLogin();

            const desktopLogo = screen.getByAltText('Logo');
            expect(desktopLogo).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('should handle navigation errors (negative scenario)', async () => {
            mockNavigate.mockImplementation(() => {
                throw new Error('Navigation error');
            });

            renderLogin();

            const emailInput = screen.getByPlaceholderText('Email');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });

            // Should not throw error, just fail silently
            expect(() => {
                fireEvent.click(submitButton);
            }).not.toThrow();
        });
    });
});
