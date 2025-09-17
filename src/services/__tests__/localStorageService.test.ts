import { localStorageService } from '../localStorageService';
import { User } from '../../data/mockUsers';

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

describe('LocalStorageService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
    });

    describe('storeUserDetails', () => {
        it('should store user details successfully (positive scenario)', async () => {
            localStorageMock.setItem.mockImplementation(() => { });

            await localStorageService.storeUserDetails(mockUser, 'Test notes', ['tag1', 'tag2']);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'lendsqr_user_details',
                expect.stringContaining('"userId":"user_1"')
            );
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'lendsqr_users',
                expect.stringContaining('"id":"user_1"')
            );
        });

        it('should store user details without notes and tags (positive scenario)', async () => {
            localStorageMock.setItem.mockImplementation(() => { });

            await localStorageService.storeUserDetails(mockUser);

            expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
        });

        it('should handle localStorage errors (negative scenario)', async () => {
            localStorageMock.setItem.mockImplementation(() => {
                throw new Error('Storage quota exceeded');
            });

            await expect(localStorageService.storeUserDetails(mockUser))
                .rejects.toThrow('Storage quota exceeded');
        });

        it('should handle invalid user data (negative scenario)', async () => {
            const invalidUser = { ...mockUser, id: null } as any;

            // The service doesn't actually throw for invalid data, it just processes it
            await localStorageService.storeUserDetails(invalidUser);

            expect(localStorageMock.setItem).toHaveBeenCalled();
        });
    });

    describe('getUserDetails', () => {
        it('should retrieve user details successfully (positive scenario)', async () => {
            const mockUserDetails = {
                id: 'details_user_1',
                userId: 'user_1',
                lastViewed: '2023-01-15T10:00:00.000Z',
                viewCount: 1,
                notes: 'Test notes',
                tags: ['tag1', 'tag2'],
                isFavorite: false,
                user: mockUser
            };

            localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUserDetails]));

            const result = await localStorageService.getUserDetails('user_1');

            expect(result).toEqual(mockUserDetails);
            expect(localStorageMock.getItem).toHaveBeenCalledWith('lendsqr_user_details');
        });

        it('should return null for non-existent user (negative scenario)', async () => {
            localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

            const result = await localStorageService.getUserDetails('nonexistent');

            expect(result).toBeNull();
        });

        it('should handle corrupted localStorage data (negative scenario)', async () => {
            localStorageMock.getItem.mockReturnValue('invalid json');

            const result = await localStorageService.getUserDetails('user_1');

            expect(result).toBeNull();
        });

        it('should handle empty localStorage (negative scenario)', async () => {
            localStorageMock.getItem.mockReturnValue(null);

            const result = await localStorageService.getUserDetails('user_1');

            expect(result).toBeNull();
        });
    });

    describe('getUser', () => {
        it('should retrieve user successfully (positive scenario)', async () => {
            localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]));

            const result = await localStorageService.getUser('user_1');

            expect(result).toEqual(mockUser);
            expect(localStorageMock.getItem).toHaveBeenCalledWith('lendsqr_users');
        });

        it('should return null for non-existent user (negative scenario)', async () => {
            localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

            const result = await localStorageService.getUser('nonexistent');

            expect(result).toBeNull();
        });

        it('should handle corrupted localStorage data (negative scenario)', async () => {
            localStorageMock.getItem.mockReturnValue('invalid json');

            const result = await localStorageService.getUser('user_1');

            expect(result).toBeNull();
        });
    });

    describe('updateUserStatus', () => {
        it('should update user status successfully (positive scenario)', async () => {
            const updatedUser = { ...mockUser, status: 'blacklisted' as const };
            localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]));

            const result = await localStorageService.updateUserStatus('user_1', 'blacklisted');

            expect(result).toEqual(updatedUser);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'lendsqr_users',
                JSON.stringify([updatedUser])
            );
        });

        it('should update user status to active (positive scenario)', async () => {
            const inactiveUser = { ...mockUser, status: 'inactive' as const };
            const updatedUser = { ...mockUser, status: 'active' as const };
            localStorageMock.getItem.mockReturnValue(JSON.stringify([inactiveUser]));

            const result = await localStorageService.updateUserStatus('user_1', 'active');

            expect(result).toEqual(updatedUser);
            expect(result?.status).toBe('active');
        });

        it('should update user status to inactive (positive scenario)', async () => {
            const updatedUser = { ...mockUser, status: 'inactive' as const };
            localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]));

            const result = await localStorageService.updateUserStatus('user_1', 'inactive');

            expect(result).toEqual(updatedUser);
            expect(result?.status).toBe('inactive');
        });

        it('should update user status to pending (positive scenario)', async () => {
            const updatedUser = { ...mockUser, status: 'pending' as const };
            localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]));

            const result = await localStorageService.updateUserStatus('user_1', 'pending');

            expect(result).toEqual(updatedUser);
            expect(result?.status).toBe('pending');
        });

        it('should return null for non-existent user (negative scenario)', async () => {
            localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

            const result = await localStorageService.updateUserStatus('nonexistent', 'active');

            expect(result).toBeNull();
        });

        it('should handle localStorage errors (negative scenario)', async () => {
            localStorageMock.getItem.mockImplementation(() => {
                throw new Error('Storage error');
            });

            // The service catches errors and returns null
            const result = await localStorageService.updateUserStatus('user_1', 'active');
            expect(result).toBeNull();
        });

        it('should update user details when user status changes (positive scenario)', async () => {
            const mockUserDetails = {
                id: 'details_user_1',
                userId: 'user_1',
                lastViewed: '2023-01-15T10:00:00.000Z',
                viewCount: 1,
                notes: 'Test notes',
                tags: ['tag1', 'tag2'],
                isFavorite: false,
                user: mockUser
            };
            const updatedUser = { ...mockUser, status: 'blacklisted' as const };

            localStorageMock.getItem
                .mockReturnValueOnce(JSON.stringify([mockUser])) // For users
                .mockReturnValueOnce(JSON.stringify([mockUserDetails])); // For user details

            const result = await localStorageService.updateUserStatus('user_1', 'blacklisted');

            expect(result).toEqual(updatedUser);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'lendsqr_user_details',
                expect.stringContaining('"status":"blacklisted"')
            );
        });

        it('should preserve other user properties when updating status (positive scenario)', async () => {
            const updatedUser = { ...mockUser, status: 'blacklisted' as const };
            localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]));

            const result = await localStorageService.updateUserStatus('user_1', 'blacklisted');

            expect(result).toEqual(updatedUser);
            expect(result?.id).toBe('user_1');
            expect(result?.username).toBe('john_doe');
            expect(result?.email).toBe('john@example.com');
            expect(result?.organization).toBe('Lendsqr');
            expect(result?.status).toBe('blacklisted');
        });

        it('should handle multiple status updates for same user (positive scenario)', async () => {
            localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]));

            // First update
            const result1 = await localStorageService.updateUserStatus('user_1', 'inactive');
            expect(result1?.status).toBe('inactive');

            // Second update
            const result2 = await localStorageService.updateUserStatus('user_1', 'active');
            expect(result2?.status).toBe('active');

            // Third update
            const result3 = await localStorageService.updateUserStatus('user_1', 'blacklisted');
            expect(result3?.status).toBe('blacklisted');
        });
    });


});
