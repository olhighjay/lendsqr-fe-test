import React from 'react';

interface OtherTabsProps {
    tabId: string;
}

const OtherTabs: React.FC<OtherTabsProps> = ({ tabId }) => {
    const renderPlaceholder = (title: string) => (
        <div className="placeholder">
            <h3>{title}</h3>
            <p>This section is coming soon. {title} information will be displayed here.</p>
        </div>
    );

    switch (tabId) {
        case 'documents':
            return renderPlaceholder('Documents');
        case 'bank':
            return renderPlaceholder('Bank Details');
        case 'loans':
            return renderPlaceholder('Loans');
        case 'savings':
            return renderPlaceholder('Savings');
        case 'app':
            return renderPlaceholder('App and System');
        default:
            return renderPlaceholder('Content');
    }
};

export default OtherTabs;
