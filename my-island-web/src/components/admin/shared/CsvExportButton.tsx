import React, { useState } from 'react';
import clsx from 'clsx';

interface CsvExportButtonProps {
  onExport: () => Promise<void>;
  label?: string;
}

export const CsvExportButton: React.FC<CsvExportButtonProps> = ({ onExport, label = 'Export CSV' }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onExport();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        loading
          ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
          : "bg-white dark:bg-[#1a2632] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
      )}
    >
      <span className="material-symbols-outlined text-lg">{loading ? 'hourglass_empty' : 'download'}</span>
      {loading ? 'Exporting...' : label}
    </button>
  );
};
