import React from 'react';
import './style.scss';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    title,
    className = '',
    onClick,
}) => {
    const cardClasses = [
        'card',
        onClick ? 'card--clickable' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClasses} onClick={onClick}>
            {title && <div className="card__header">{title}</div>}
            <div className="card__body">{children}</div>
        </div>
    );
};

export default Card;
