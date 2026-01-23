import React from 'react';

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;
}

export const DateInput: React.FC<DateInputProps> = ({
    value,
    onChange,
    className = "",
    placeholder,
    ...props
}) => {
    // Format YYYY-MM-DD to DD/MM/YYYY for display
    const formatDisplayDate = (isoDate: string) => {
        if (!isoDate) return '';
        const [y, m, d] = isoDate.split('-');
        if (!y || !m || !d) return isoDate;
        return `${d}/${m}/${y}`;
    };

    return (
        <div className="relative w-full">
            {/* Visible Text Input (Formatted) */}
            <input
                type="text"
                className={`${className} cursor-pointer`}
                placeholder={placeholder}
                value={formatDisplayDate(value)}
                readOnly
                {...props}
            />
            {/* Invisible Native Date Input (Picker) */}
            <input
                type="date"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()} // Helper to force show picker on some browsers
            />
        </div>
    );
};
