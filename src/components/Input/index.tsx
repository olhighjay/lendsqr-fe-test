import React from 'react';
import './style.scss';

interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    name?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    id?: string;
    autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
    type = 'text',
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    disabled = false,
    required = false,
    className = '',
    id,
    autoComplete,
}) => {
    const inputClasses = [
        'input',
        className,
    ].filter(Boolean).join(' ');

    return (
        <input
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            className={inputClasses}
        />
    );
};

export default Input;
