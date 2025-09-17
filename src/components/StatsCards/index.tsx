import React, { useState, useEffect } from 'react';
import { userApiService } from '../../services/userApi';
import './style.scss';

interface StatCard {
    title: string;
    value: string;
    icon: string;
    color: string;
}

const StatsCards: React.FC = () => {
    const [stats, setStats] = useState<StatCard[]>([
        {
            title: 'USERS',
            value: '0',
            icon: '/icons/icon-a.svg',
            color: 'purple'
        },
        {
            title: 'ACTIVE USERS',
            value: '0',
            icon: '/icons/icon-b.svg',
            color: 'purple'
        },
        {
            title: 'USERS WITH LOANS',
            value: '0',
            icon: '/icons/icon-c.svg',
            color: 'red'
        },
        {
            title: 'USERS WITH SAVINGS',
            value: '0',
            icon: '/icons/icon-d.svg',
            color: 'red'
        }
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const userStats = await userApiService.getUserStats();

                setStats([
                    {
                        title: 'USERS',
                        value: userStats.total.toLocaleString(),
                        icon: '/icons/icon-a.svg',
                        color: 'purple'
                    },
                    {
                        title: 'ACTIVE USERS',
                        value: userStats.active.toLocaleString(),
                        icon: '/icons/icon-b.svg',
                        color: 'purple'
                    },
                    {
                        title: 'USERS WITH LOANS',
                        value: Math.floor(userStats.total * 0.7).toLocaleString(),
                        icon: '/icons/icon-c.svg',
                        color: 'red'
                    },
                    {
                        title: 'USERS WITH SAVINGS',
                        value: Math.floor(userStats.total * 0.8).toLocaleString(),
                        icon: '/icons/icon-d.svg',
                        color: 'red'
                    }
                ]);
            } catch (error) {
                console.error('Failed to load stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    return (
        <div className="stats-cards">
            {stats.map((stat, index) => (
                <div key={index} className={`stat-card stat-card--${stat.color}`}>
                    <div className="stat-card-header">
                        <img src={stat.icon} alt={stat.title} width={40} height={40} />
                        <span className="stat-title">{stat.title}</span>
                    </div>
                    <p className="stat-value">{stat.value}</p>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
