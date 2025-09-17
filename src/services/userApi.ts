import { User, users } from '../data/mockUsers';

export interface UserListResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UserFilters {
    organization?: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
    dateJoined?: string;
    status?: string;
}

export interface UserListParams {
    page?: number;
    limit?: number;
    search?: string;
    filters?: UserFilters;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

class UserApiService {
    private users: User[] = users;

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async getUsers(params: UserListParams = {}): Promise<UserListResponse> {
        await this.delay(300);

        const {
            page = 1,
            limit = 10,
            search = '',
            filters = {},
            sortBy = 'dateJoined',
            sortOrder = 'desc'
        } = params;

        let filteredUsers = [...this.users];

        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = filteredUsers.filter(user =>
                user.personalInfo.fullName.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.username.toLowerCase().includes(searchLower) ||
                user.organization.toLowerCase().includes(searchLower) ||
                user.phoneNumber.includes(search)
            );
        }

        if (filters.organization) {
            filteredUsers = filteredUsers.filter(user =>
                user.organization.toLowerCase().includes(filters.organization!.toLowerCase())
            );
        }

        if (filters.username) {
            filteredUsers = filteredUsers.filter(user =>
                user.username.toLowerCase().includes(filters.username!.toLowerCase())
            );
        }

        if (filters.email) {
            filteredUsers = filteredUsers.filter(user =>
                user.email.toLowerCase().includes(filters.email!.toLowerCase())
            );
        }

        if (filters.phoneNumber) {
            filteredUsers = filteredUsers.filter(user =>
                user.phoneNumber.includes(filters.phoneNumber!)
            );
        }

        if (filters.dateJoined) {
            filteredUsers = filteredUsers.filter(user =>
                user.dateJoined === filters.dateJoined
            );
        }

        if (filters.status) {
            filteredUsers = filteredUsers.filter(user =>
                user.status === filters.status
            );
        }

        filteredUsers.sort((a, b) => {
            let aValue: any = a[sortBy as keyof User];
            let bValue: any = b[sortBy as keyof User];

            if (sortBy === 'fullName') {
                aValue = a.personalInfo.fullName;
                bValue = b.personalInfo.fullName;
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        return {
            users: paginatedUsers,
            total: filteredUsers.length,
            page,
            limit,
            totalPages: Math.ceil(filteredUsers.length / limit)
        };
    }

    async getUserById(id: string): Promise<User | null> {
        await this.delay(200);

        const user = this.users.find(user => user.id === id);
        return user || null;
    }

    async getUserStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        pending: number;
        blacklisted: number;
    }> {
        await this.delay(150);

        const stats = this.users.reduce((acc, user) => {
            acc.total++;
            acc[user.status]++;
            return acc;
        }, {
            total: 0,
            active: 0,
            inactive: 0,
            pending: 0,
            blacklisted: 0
        });

        return stats;
    }

    async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'pending' | 'blacklisted'): Promise<User | null> {
        await this.delay(200);

        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return null;
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            status
        };

        return this.users[userIndex];
    }
}

export const userApiService = new UserApiService();
export default userApiService;
