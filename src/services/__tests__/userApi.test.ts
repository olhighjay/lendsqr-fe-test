import { userApiService } from '../userApi';
import { User } from '../../data/mockUsers';

// Mock the mockUsers data
jest.mock('../../data/mockUsers', () => ({
    users: [
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
    ]
}));

describe('UserApiService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        it('should return users with default pagination (positive scenario)', async () => {
            const result = await userApiService.getUsers();

            expect(result).toHaveProperty('users');
            expect(result).toHaveProperty('total');
            expect(result).toHaveProperty('page');
            expect(result).toHaveProperty('limit');
            expect(result).toHaveProperty('totalPages');
            expect(result.users).toHaveLength(2);
            expect(result.total).toBe(2);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
        });

        it('should return users with custom pagination (positive scenario)', async () => {
            const result = await userApiService.getUsers({ page: 1, limit: 1 });

            expect(result.users).toHaveLength(1);
            expect(result.total).toBe(2);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(1);
            expect(result.totalPages).toBe(2);
        });

        it('should filter users by organization (positive scenario)', async () => {
            const result = await userApiService.getUsers({
                filters: { organization: 'Lendsqr' }
            });

            expect(result.users).toHaveLength(1);
            expect(result.users[0].organization).toBe('Lendsqr');
            expect(result.total).toBe(1);
        });

        it('should filter users by status (positive scenario)', async () => {
            const result = await userApiService.getUsers({
                filters: { status: 'active' }
            });

            expect(result.users).toHaveLength(1);
            expect(result.users[0].status).toBe('active');
            expect(result.total).toBe(1);
        });

        it('should search users by name (positive scenario)', async () => {
            const result = await userApiService.getUsers({
                search: 'john'
            });

            expect(result.users).toHaveLength(1);
            expect(result.users[0].personalInfo.fullName).toContain('John');
            expect(result.total).toBe(1);
        });

        it('should search users by email (positive scenario)', async () => {
            const result = await userApiService.getUsers({
                search: 'jane@example.com'
            });

            expect(result.users).toHaveLength(1);
            expect(result.users[0].email).toBe('jane@example.com');
            expect(result.total).toBe(1);
        });

        it('should sort users by date joined descending (positive scenario)', async () => {
            const result = await userApiService.getUsers({
                sortBy: 'dateJoined',
                sortOrder: 'desc'
            });

            expect(result.users[0].dateJoined).toBe('2023-02-20');
            expect(result.users[1].dateJoined).toBe('2023-01-15');
        });

        it('should sort users by name ascending (positive scenario)', async () => {
            const result = await userApiService.getUsers({
                sortBy: 'fullName',
                sortOrder: 'asc'
            });

            expect(result.users[0].personalInfo.fullName).toBe('Jane Smith');
            expect(result.users[1].personalInfo.fullName).toBe('John Doe');
        });

        it('should return empty results for non-existent search (negative scenario)', async () => {
            const result = await userApiService.getUsers({
                search: 'nonexistent'
            });

            expect(result.users).toHaveLength(0);
            expect(result.total).toBe(0);
        });

        it('should return empty results for non-existent filter (negative scenario)', async () => {
            const result = await userApiService.getUsers({
                filters: { organization: 'NonExistent' }
            });

            expect(result.users).toHaveLength(0);
            expect(result.total).toBe(0);
        });

        it('should handle invalid page number (negative scenario)', async () => {
            const result = await userApiService.getUsers({
                page: -1,
                limit: 10
            });

            expect(result.page).toBe(-1);
            expect(result.users).toHaveLength(0);
        });

        it('should handle zero limit (negative scenario)', async () => {
            const result = await userApiService.getUsers({
                page: 1,
                limit: 0
            });

            expect(result.limit).toBe(0);
            expect(result.users).toHaveLength(0);
        });
    });

    describe('getUserById', () => {
        it('should return user by valid ID (positive scenario)', async () => {
            const result = await userApiService.getUserById('user_1');

            expect(result).toBeDefined();
            expect(result?.id).toBe('user_1');
            expect(result?.username).toBe('john_doe');
        });

        it('should return null for non-existent ID (negative scenario)', async () => {
            const result = await userApiService.getUserById('nonexistent');

            expect(result).toBeNull();
        });

        it('should return null for empty ID (negative scenario)', async () => {
            const result = await userApiService.getUserById('');

            expect(result).toBeNull();
        });
    });

    describe('getUserStats', () => {
        it('should return correct user statistics (positive scenario)', async () => {
            const result = await userApiService.getUserStats();

            expect(result).toHaveProperty('total');
            expect(result).toHaveProperty('active');
            expect(result).toHaveProperty('inactive');
            expect(result).toHaveProperty('pending');
            expect(result).toHaveProperty('blacklisted');
            expect(result.total).toBe(2);
            expect(result.active).toBe(1);
            expect(result.inactive).toBe(1);
            expect(result.pending).toBe(0);
            expect(result.blacklisted).toBe(0);
        });
    });

});
