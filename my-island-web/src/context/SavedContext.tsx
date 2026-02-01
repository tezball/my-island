import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lot } from '../types/booking';
import { MOCK_DB } from '../services/mockData';

interface SavedContextType {
    savedLots: Lot[];
    toggleSaved: (lotId: string) => void;
    isSaved: (lotId: string) => boolean;
    clearSaved: () => void;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

const STORAGE_KEY = 'myisland_saved_lots';

export const SavedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [savedLotIds, setSavedLotIds] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLotIds));
    }, [savedLotIds]);

    const savedLots = MOCK_DB.lots.filter(lot => savedLotIds.includes(lot.id));

    const toggleSaved = (lotId: string) => {
        setSavedLotIds(prev => {
            if (prev.includes(lotId)) {
                return prev.filter(id => id !== lotId);
            }
            return [...prev, lotId];
        });
    };

    const isSaved = (lotId: string) => savedLotIds.includes(lotId);

    const clearSaved = () => setSavedLotIds([]);

    return (
        <SavedContext.Provider value={{ savedLots, toggleSaved, isSaved, clearSaved }}>
            {children}
        </SavedContext.Provider>
    );
};

export const useSaved = () => {
    const context = useContext(SavedContext);
    if (!context) {
        throw new Error('useSaved must be used within a SavedProvider');
    }
    return context;
};
