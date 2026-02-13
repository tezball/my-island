import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'cookie_consent';

export const CookieConsentBanner: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(STORAGE_KEY);
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, timestamp: new Date().toISOString() }));
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-[72px] left-0 right-0 z-40 px-4 pb-2">
            <div className="max-w-3xl mx-auto bg-[#1a2632] text-white rounded-xl shadow-lg px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <p className="text-sm text-gray-300 flex-1">
                    We use essential cookies and local storage to keep you signed in and remember your preferences. No third-party tracking.{' '}
                    <Link to="/privacy" className="text-primary hover:text-[#20d85f] underline transition-colors">Learn more</Link>
                </p>
                <button
                    onClick={handleAccept}
                    className="shrink-0 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-[#20d85f] active:scale-[0.98] transition-all"
                >
                    Accept
                </button>
            </div>
        </div>
    );
};
