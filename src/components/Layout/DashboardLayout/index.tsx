import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import './style.scss';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        // Clear any stored authentication data
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');

        // Navigate to login page
        navigate('/login');
    };

    return (
        <div>
            <Navbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <div className="dashboard-layout">
                <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} onLogout={handleLogout} />
                {sidebarOpen && isMobile && (
                    <div className="sidebar-backdrop" onClick={toggleSidebar}></div>
                )}
                <div className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                    <div className="dashboard-content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
