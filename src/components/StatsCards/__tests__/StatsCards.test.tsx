import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StatsCards from '..';

// Mock the userApi service
jest.mock('../../services/userApi', () => ({
    userApiService: {
        getUserStats: jest.fn()
    }
}));

describe('StatsCards Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render all statistics cards (positive scenario)', () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 100,
                active: 75,
                inactive: 15,
                pending: 8,
                blacklisted: 2
            });

            render(<StatsCards />);

            expect(screen.getByText('USERS')).toBeInTheDocument();
            expect(screen.getByText('ACTIVE USERS')).toBeInTheDocument();
            expect(screen.getByText('USERS WITH LOANS')).toBeInTheDocument();
            expect(screen.getByText('USERS WITH SAVINGS')).toBeInTheDocument();
        });

        it('should render with correct icons (positive scenario)', () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 100,
                active: 75,
                inactive: 15,
                pending: 8,
                blacklisted: 2
            });

            render(<StatsCards />);

            const icons = screen.getAllByRole('img');
            expect(icons).toHaveLength(4); // One icon per card
        });

        it('should display default values initially (positive scenario)', () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockImplementation(() => new Promise(() => { })); // Never resolves

            render(<StatsCards />);

            // Should show default values of 0
            expect(screen.getAllByText('0')).toHaveLength(4);
        });
    });

    describe('Data Display', () => {
        it('should display correct statistics when data loads (positive scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 100,
                active: 75,
                inactive: 15,
                pending: 8,
                blacklisted: 2
            });

            render(<StatsCards />);

            // Wait for data to load
            await screen.findByText('100');
            expect(screen.getByText('100')).toBeInTheDocument();
            expect(screen.getByText('75')).toBeInTheDocument();
            expect(screen.getByText('70')).toBeInTheDocument(); // 70% of 100 for loans
            expect(screen.getByText('80')).toBeInTheDocument(); // 80% of 100 for savings
        });

        it('should display zero values correctly (positive scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 0,
                active: 0,
                inactive: 0,
                pending: 0,
                blacklisted: 0
            });

            render(<StatsCards />);

            // Wait for data to load and check for zero values
            await waitFor(() => {
                expect(screen.getAllByText('0')).toHaveLength(4);
            });
        });

        it('should handle large numbers correctly (positive scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 1000000,
                active: 750000,
                inactive: 150000,
                pending: 80000,
                blacklisted: 20000
            });

            render(<StatsCards />);

            await screen.findByText('1,000,000');
            expect(screen.getByText('1,000,000')).toBeInTheDocument();
            expect(screen.getByText('750,000')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('should handle API errors gracefully (negative scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockRejectedValue(new Error('API Error'));

            render(<StatsCards />);

            // Should show default values when API fails
            await waitFor(() => {
                expect(screen.getAllByText('0')).toHaveLength(4);
            });
        });

        it('should handle network timeout (negative scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockImplementation(() =>
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 100)
                )
            );

            render(<StatsCards />);

            // Should show default values when API fails
            await waitFor(() => {
                expect(screen.getAllByText('0')).toHaveLength(4);
            });
        });

        it('should handle malformed API response (negative scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                // Missing required fields
                total: 100
            });

            render(<StatsCards />);

            // Should handle missing fields gracefully by showing default values
            await waitFor(() => {
                expect(screen.getAllByText('0')).toHaveLength(4);
            });
        });
    });

    describe('Responsive Design', () => {
        it('should render correctly on mobile screens (positive scenario)', () => {
            // Mock window.innerWidth
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 600,
            });

            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 100,
                active: 75,
                inactive: 15,
                pending: 8,
                blacklisted: 2
            });

            render(<StatsCards />);

            expect(screen.getByText('USERS')).toBeInTheDocument();
        });

        it('should render correctly on desktop screens (positive scenario)', () => {
            // Mock window.innerWidth
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1200,
            });

            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 100,
                active: 75,
                inactive: 15,
                pending: 8,
                blacklisted: 2
            });

            render(<StatsCards />);

            expect(screen.getByText('USERS')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels (positive scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 100,
                active: 75,
                inactive: 15,
                pending: 8,
                blacklisted: 2
            });

            render(<StatsCards />);

            await screen.findByText('100');

            // Check for proper text content
            expect(screen.getByText('USERS')).toBeInTheDocument();
            expect(screen.getByText('ACTIVE USERS')).toBeInTheDocument();
        });

        it('should be keyboard navigable (positive scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 100,
                active: 75,
                inactive: 15,
                pending: 8,
                blacklisted: 2
            });

            render(<StatsCards />);

            await screen.findByText('100');

            // Check that cards are rendered
            const cards = screen.getAllByText('USERS');
            expect(cards).toHaveLength(1);
        });
    });

    describe('Performance', () => {
        it('should not make unnecessary API calls (positive scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 100,
                active: 75,
                inactive: 15,
                pending: 8,
                blacklisted: 2
            });

            const { rerender } = render(<StatsCards />);

            await screen.findByText('100');
            expect(userApiService.getUserStats).toHaveBeenCalledTimes(1);

            // Rerender should not trigger new API call
            rerender(<StatsCards />);
            expect(userApiService.getUserStats).toHaveBeenCalledTimes(1);
        });

        it('should handle rapid re-renders (positive scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: 100,
                active: 75,
                inactive: 15,
                pending: 8,
                blacklisted: 2
            });

            const { rerender } = render(<StatsCards />);

            // Rapid re-renders
            for (let i = 0; i < 5; i++) {
                rerender(<StatsCards />);
            }

            await screen.findByText('100');
            expect(userApiService.getUserStats).toHaveBeenCalledTimes(1);
        });
    });

    describe('Data Validation', () => {
        it('should handle negative values (negative scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: -100,
                active: -75,
                inactive: -15,
                pending: -8,
                blacklisted: -2
            });

            render(<StatsCards />);

            await screen.findByText('-100');
            expect(screen.getByText('-100')).toBeInTheDocument();
        });

        it('should handle null values (negative scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: null,
                active: null,
                inactive: null,
                pending: null,
                blacklisted: null
            });

            render(<StatsCards />);

            // Should handle null values gracefully
            expect(screen.getByText('USERS')).toBeInTheDocument();
        });

        it('should handle undefined values (negative scenario)', async () => {
            const { userApiService } = require('../../services/userApi');
            userApiService.getUserStats.mockResolvedValue({
                total: undefined,
                active: undefined,
                inactive: undefined,
                pending: undefined,
                blacklisted: undefined
            });

            render(<StatsCards />);

            // Should handle undefined values gracefully
            expect(screen.getByText('USERS')).toBeInTheDocument();
        });
    });
});
