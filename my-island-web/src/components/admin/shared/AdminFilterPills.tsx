import React from 'react';
import clsx from 'clsx';

interface FilterOption {
  label: string;
  value: string;
}

interface AdminFilterPillsProps {
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
}

export const AdminFilterPills: React.FC<AdminFilterPillsProps> = ({ options, selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            selected === opt.value
              ? "bg-red-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
