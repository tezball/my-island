import React, { useState, useMemo } from 'react';

interface BookedDateRange {
    checkIn: string;
    checkOut: string;
}

interface AvailabilityCalendarProps {
    bookedDates: BookedDateRange[];
    selectedCheckIn: string | null;
    selectedCheckOut: string | null;
    onDateSelect: (date: string) => void;
    minDate?: string;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
    bookedDates,
    selectedCheckIn,
    selectedCheckOut,
    onDateSelect,
    minDate,
}) => {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const effectiveMinDate = minDate ? new Date(minDate) : today;

    // Create a Set of all booked dates for quick lookup
    const bookedDateSet = useMemo(() => {
        const set = new Set<string>();
        bookedDates.forEach(range => {
            const start = new Date(range.checkIn);
            const end = new Date(range.checkOut);
            // Mark all dates from checkIn to checkOut-1 (checkout day is available for new checkin)
            for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
                set.add(d.toISOString().split('T')[0]);
            }
        });
        return set;
    }, [bookedDates]);

    const isDateBooked = (date: Date): boolean => {
        return bookedDateSet.has(date.toISOString().split('T')[0]);
    };

    const isDateInPast = (date: Date): boolean => {
        return date < effectiveMinDate;
    };

    const isDateSelected = (date: Date): boolean => {
        const dateStr = date.toISOString().split('T')[0];
        return dateStr === selectedCheckIn || dateStr === selectedCheckOut;
    };

    const isDateInRange = (date: Date): boolean => {
        if (!selectedCheckIn || !selectedCheckOut) return false;
        const dateStr = date.toISOString().split('T')[0];
        return dateStr > selectedCheckIn && dateStr < selectedCheckOut;
    };

    // Check if there are any booked dates between two dates
    const hasBookedDatesBetween = (startDate: string, endDate: string): boolean => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            if (bookedDateSet.has(d.toISOString().split('T')[0])) {
                return true;
            }
        }
        return false;
    };

    const getDaysInMonth = (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number): number => {
        return new Date(year, month, 1).getDay();
    };

    const formatMonthYear = (date: Date): string => {
        return date.toLocaleDateString('en-IE', { month: 'long', year: 'numeric' });
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (date: Date) => {
        if (isDateInPast(date) || isDateBooked(date)) return;

        const dateStr = date.toISOString().split('T')[0];

        // If selecting checkout (check-in exists, checkout doesn't, and date is after check-in)
        if (selectedCheckIn && !selectedCheckOut && dateStr > selectedCheckIn) {
            // Check if there are booked dates between check-in and this date
            if (hasBookedDatesBetween(selectedCheckIn, dateStr)) {
                // Don't allow - there are booked dates in between
                return;
            }
        }

        onDateSelect(dateStr);
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days: React.ReactNode[] = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const isPast = isDateInPast(date);
            const isBooked = isDateBooked(date);
            const isSelected = isDateSelected(date);
            const inRange = isDateInRange(date);
            const isCheckIn = dateStr === selectedCheckIn;
            const isCheckOut = dateStr === selectedCheckOut;

            // Check if this date would create an invalid range (selecting it as checkout would span booked dates)
            const wouldCreateInvalidRange = !!(selectedCheckIn && !selectedCheckOut &&
                dateStr > selectedCheckIn && hasBookedDatesBetween(selectedCheckIn, dateStr));

            let bgColor = 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700';
            let textColor = 'text-gray-900 dark:text-white';
            let cursor = 'cursor-pointer';

            if (isPast) {
                bgColor = 'bg-gray-100 dark:bg-gray-900';
                textColor = 'text-gray-300 dark:text-gray-600';
                cursor = 'cursor-not-allowed';
            } else if (isBooked) {
                bgColor = 'bg-red-100 dark:bg-red-900/30';
                textColor = 'text-red-400 dark:text-red-500';
                cursor = 'cursor-not-allowed';
            } else if (wouldCreateInvalidRange) {
                bgColor = 'bg-gray-100 dark:bg-gray-900';
                textColor = 'text-gray-400 dark:text-gray-500';
                cursor = 'cursor-not-allowed';
            } else if (isSelected) {
                bgColor = 'bg-primary';
                textColor = 'text-white';
            } else if (inRange) {
                bgColor = 'bg-primary/20';
                textColor = 'text-primary dark:text-primary';
            }

            days.push(
                <button
                    type="button"
                    key={day}
                    onClick={() => handleDateClick(date)}
                    disabled={isPast || isBooked || wouldCreateInvalidRange}
                    className={`h-10 w-full rounded-lg text-sm font-medium transition-colors ${bgColor} ${textColor} ${cursor} flex items-center justify-center relative`}
                >
                    {day}
                    {isCheckIn && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-primary font-bold">IN</span>
                    )}
                    {isCheckOut && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-primary font-bold">OUT</span>
                    )}
                </button>
            );
        }

        return days;
    };

    const canGoPrev = currentMonth > new Date(today.getFullYear(), today.getMonth(), 1);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={!canGoPrev}
                    className={`p-2 rounded-lg ${canGoPrev ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'opacity-30 cursor-not-allowed'}`}
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {formatMonthYear(currentMonth)}
                </h3>
                <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Unavailable</span>
                </div>
            </div>
        </div>
    );
};
