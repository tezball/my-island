import React, { useRef } from 'react';

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    minDate?: string; // Optional minimum date in YYYY-MM-DD format
}

export const DateInput: React.FC<DateInputProps> = ({
    value,
    onChange,
    className = "",
    placeholder,
    minDate,
    ...props
}) => {
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Format YYYY-MM-DD to DD/MM/YYYY for display
    const formatDisplayDate = (isoDate: string) => {
        if (!isoDate) return '';
        const [y, m, d] = isoDate.split('-');
        if (!y || !m || !d) return isoDate;
        return `${d}/${m}/${y}`;
    };

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0];
    const effectiveMinDate = minDate || today;

    const handleContainerClick = () => {
        // Programmatically trigger the date picker
        if (dateInputRef.current) {
            try {
                dateInputRef.current.showPicker?.();
            } catch {
                // Fallback for browsers that don't support showPicker
                dateInputRef.current.focus();
                dateInputRef.current.click();
            }
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
    };

    return (
        <div
            className="relative w-full cursor-pointer"
            onClick={handleContainerClick}
        >
            {/* Visible Text Input (Formatted) */}
            <input
                type="text"
                className={`${className} cursor-pointer`}
                placeholder={placeholder}
                value={formatDisplayDate(value)}
                readOnly
                tabIndex={-1}
                {...props}
            />
            {/* Native Date Input - positioned to overlay but still interactive */}
            <input
                ref={dateInputRef}
                type="date"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={value}
                min={effectiveMinDate}
                onChange={handleDateChange}
            />
        </div>
    );
};
