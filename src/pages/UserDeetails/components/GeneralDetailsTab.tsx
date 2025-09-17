import React from 'react';
import { User } from '../../../data/mockUsers';

interface GeneralDetailsTabProps {
    user: User;
}

const GeneralDetailsTab: React.FC<GeneralDetailsTabProps> = ({ user }) => {
    return (
        <div className="general-details">
            <div className="detail-section">
                <h3 className="section-title">Personal Information</h3>
                <div className="detail-grid personal-info">
                    <div className="detail-item">
                        <span className="detail-label">FULL NAME</span>
                        <span className="detail-value">{user.personalInfo.fullName}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">PHONE NUMBER</span>
                        <span className="detail-value">{user.personalInfo.phoneNumber}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">EMAIL ADDRESS</span>
                        <span className="detail-value">{user.personalInfo.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">BVN</span>
                        <span className="detail-value">{user.personalInfo.bvn}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">GENDER</span>
                        <span className="detail-value">{user.personalInfo.gender}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">MARITAL STATUS</span>
                        <span className="detail-value">{user.personalInfo.maritalStatus}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">CHILDREN</span>
                        <span className="detail-value">{user.personalInfo.children}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">TYPE OF RESIDENCE</span>
                        <span className="detail-value">{user.personalInfo.typeOfResidence}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">USER'S TIER</span>
                        <span className="detail-value">Tier {user.tier}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3 className="section-title">Education and Employment</h3>
                <div className="detail-grid education-employment">
                    <div className="detail-item">
                        <span className="detail-label">LEVEL OF EDUCATION</span>
                        <span className="detail-value">{user.educationAndEmployment.levelOfEducation}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">EMPLOYMENT STATUS</span>
                        <span className="detail-value">{user.educationAndEmployment.employmentStatus}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">SECTOR OF EMPLOYMENT</span>
                        <span className="detail-value">{user.educationAndEmployment.sectorOfEmployment}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">DURATION OF EMPLOYMENT</span>
                        <span className="detail-value">{user.educationAndEmployment.durationOfEmployment}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">OFFICE EMAIL</span>
                        <span className="detail-value">{user.educationAndEmployment.officeEmail}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">MONTHLY INCOME</span>
                        <span className="detail-value">{user.educationAndEmployment.monthlyIncome}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">LOAN REPAYMENT</span>
                        <span className="detail-value">{user.educationAndEmployment.loanRepayment}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3 className="section-title">Socials</h3>
                <div className="detail-grid socials">
                    <div className="detail-item">
                        <span className="detail-label">TWITTER</span>
                        <span className="detail-value">{user.socials.twitter}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">FACEBOOK</span>
                        <span className="detail-value">{user.socials.facebook}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">INSTAGRAM</span>
                        <span className="detail-value">{user.socials.instagram}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3 className="section-title">Guarantor</h3>
                {user.guarantors.map((guarantor, index) => (
                    <div key={index} className="detail-grid guarantor">
                        <div className="detail-item">
                            <span className="detail-label">FULL NAME</span>
                            <span className="detail-value">{guarantor.fullName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">PHONE NUMBER</span>
                            <span className="detail-value">{guarantor.phoneNumber}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">EMAIL ADDRESS</span>
                            <span className="detail-value">{guarantor.emailAddress}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">RELATIONSHIP</span>
                            <span className="detail-value">{guarantor.relationship}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GeneralDetailsTab;
