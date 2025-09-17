import { User } from '../data/mockUsers';

interface UserDetails {
    id: string;
    userId: string;
    lastViewed: string;
    viewCount: number;
    notes?: string;
    tags?: string[];
    isFavorite: boolean;
    user: User;
}

class LocalStorageService {
    private readonly STORAGE_KEY = 'lendsqr_user_details';
    private readonly USERS_KEY = 'lendsqr_users';

    async storeUserDetails(user: User, notes?: string, tags?: string[]): Promise<void> {
        try {
            const userDetails: UserDetails = {
                id: `details_${user.id}`,
                userId: user.id,
                lastViewed: new Date().toISOString(),
                viewCount: await this.getUserViewCount(user.id) + 1,
                notes: notes || '',
                tags: tags || [],
                isFavorite: false,
                user: user
            };

            // Store user in users storage
            const users = this.getStoredUsers();
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex >= 0) {
                users[userIndex] = user;
            } else {
                users.push(user);
            }
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

            // Store user details
            const userDetailsList = this.getStoredUserDetails();
            const detailsIndex = userDetailsList.findIndex(d => d.userId === user.id);
            if (detailsIndex >= 0) {
                userDetailsList[detailsIndex] = userDetails;
            } else {
                userDetailsList.push(userDetails);
            }
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userDetailsList));
        } catch (error) {
            console.error('Failed to store user details:', error);
            throw error;
        }
    }

    async getUserDetails(userId: string): Promise<UserDetails | null> {
        try {
            const userDetailsList = this.getStoredUserDetails();
            return userDetailsList.find(d => d.userId === userId) || null;
        } catch (error) {
            console.error('Failed to get user details:', error);
            return null;
        }
    }

    async getUser(userId: string): Promise<User | null> {
        try {
            const users = this.getStoredUsers();
            return users.find(u => u.id === userId) || null;
        } catch (error) {
            console.error('Failed to get user:', error);
            return null;
        }
    }

    // Get user view count
    async getUserViewCount(userId: string): Promise<number> {
        const userDetails = await this.getUserDetails(userId);
        return userDetails?.viewCount || 0;
    }

    // Update user notes
    async updateUserNotes(userId: string, notes: string): Promise<void> {
        try {
            const userDetailsList = this.getStoredUserDetails();
            const userDetails = userDetailsList.find(d => d.userId === userId);
            if (userDetails) {
                userDetails.notes = notes;
                userDetails.lastViewed = new Date().toISOString();
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userDetailsList));
            }
        } catch (error) {
            console.error('Failed to update user notes:', error);
            throw error;
        }
    }

    // Update user tags
    async updateUserTags(userId: string, tags: string[]): Promise<void> {
        try {
            const userDetailsList = this.getStoredUserDetails();
            const userDetails = userDetailsList.find(d => d.userId === userId);
            if (userDetails) {
                userDetails.tags = tags;
                userDetails.lastViewed = new Date().toISOString();
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userDetailsList));
            }
        } catch (error) {
            console.error('Failed to update user tags:', error);
            throw error;
        }
    }

    // Toggle favorite status
    async toggleFavorite(userId: string): Promise<boolean> {
        try {
            const userDetailsList = this.getStoredUserDetails();
            const userDetails = userDetailsList.find(d => d.userId === userId);
            if (userDetails) {
                userDetails.isFavorite = !userDetails.isFavorite;
                userDetails.lastViewed = new Date().toISOString();
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userDetailsList));
                return userDetails.isFavorite;
            }
            return false;
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            throw error;
        }
    }

    // Get recently viewed users
    async getRecentlyViewed(limit: number = 10): Promise<UserDetails[]> {
        try {
            const userDetailsList = this.getStoredUserDetails();
            return userDetailsList
                .sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime())
                .slice(0, limit);
        } catch (error) {
            console.error('Failed to get recently viewed:', error);
            return [];
        }
    }

    // Get favorite users
    async getFavoriteUsers(): Promise<UserDetails[]> {
        try {
            const userDetailsList = this.getStoredUserDetails();
            return userDetailsList.filter(d => d.isFavorite);
        } catch (error) {
            console.error('Failed to get favorite users:', error);
            return [];
        }
    }

    // Search users in localStorage
    async searchUsers(query: string, limit: number = 10): Promise<User[]> {
        try {
            const users = this.getStoredUsers();
            const searchLower = query.toLowerCase();

            const filteredUsers = users.filter(user =>
                user.personalInfo.fullName.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.username.toLowerCase().includes(searchLower) ||
                user.organization.toLowerCase().includes(searchLower)
            );

            return filteredUsers.slice(0, limit);
        } catch (error) {
            console.error('Failed to search users:', error);
            return [];
        }
    }

    // Clear all data
    async clearAllData(): Promise<void> {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.USERS_KEY);
        } catch (error) {
            console.error('Failed to clear data:', error);
            throw error;
        }
    }

    // Get storage statistics
    async getStats(): Promise<{
        totalUsers: number;
        totalUserDetails: number;
        favoriteUsers: number;
        recentlyViewed: number;
    }> {
        try {
            const users = this.getStoredUsers();
            const userDetailsList = this.getStoredUserDetails();

            return {
                totalUsers: users.length,
                totalUserDetails: userDetailsList.length,
                favoriteUsers: userDetailsList.filter(d => d.isFavorite).length,
                recentlyViewed: userDetailsList.length
            };
        } catch (error) {
            console.error('Failed to get stats:', error);
            return {
                totalUsers: 0,
                totalUserDetails: 0,
                favoriteUsers: 0,
                recentlyViewed: 0
            };
        }
    }

    // Helper methods
    private getStoredUsers(): User[] {
        try {
            const stored = localStorage.getItem(this.USERS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to parse stored users:', error);
            return [];
        }
    }

    private getStoredUserDetails(): UserDetails[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to parse stored user details:', error);
            return [];
        }
    }
}

export const localStorageService = new LocalStorageService();
export default localStorageService;
