import mockUsersData from './mockUsers.json';

export interface User {
    id: string;
    organization: string;
    username: string;
    email: string;
    phoneNumber: string;
    dateJoined: string;
    status: 'active' | 'inactive' | 'pending' | 'blacklisted';
    tier: number;
    personalInfo: {
        fullName: string;
        phoneNumber: string;
        email: string;
        bvn: string;
        gender: 'Male' | 'Female';
        maritalStatus: 'Single' | 'Married' | 'Divorced';
        children: string;
        typeOfResidence: string;
    };
    educationAndEmployment: {
        levelOfEducation: string;
        employmentStatus: string;
        sectorOfEmployment: string;
        durationOfEmployment: string;
        officeEmail: string;
        monthlyIncome: string;
        loanRepayment: string;
    };
    socials: {
        twitter: string;
        facebook: string;
        instagram: string;
    };
    guarantors: {
        fullName: string;
        phoneNumber: string;
        emailAddress: string;
        relationship: string;
    }[];
    accountBalance: string;
    bankName: string;
    accountNumber: string;
    avatar: string;
}

export const mockUsers: User[] = mockUsersData.map((user: any) => {
    return {
        ...user,
        personalInfo: {
            ...user.personalInfo,
            fullName: user.username.replace(/_/g, ' '),
            email: user.email,
            phoneNumber: user.phoneNumber
        },
        guarantors: user.guarantors.map((guarantor: any) => ({
            ...guarantor,
            phoneNumber: guarantor.phoneNumber
        }))
    };
});

export const users = mockUsers;
