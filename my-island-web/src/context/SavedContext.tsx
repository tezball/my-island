import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Lot } from '../types/booking';
import { campsiteService } from '../services/campsiteService';

interface SavedContextType {
    savedLots: Lot[];
    savedLotIds: string[];
    toggleSaved: (lotId: string) => void;
    isSaved: (lotId: string) => boolean;
    clearSaved: () => void;
    isLoading: boolean;
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
    const [savedLots, setSavedLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLotIds));
    }, [savedLotIds]);

    // Fetch lot details when savedLotIds changes
    const fetchSavedLots = useCallback(async () => {
        if (savedLotIds.length === 0) {
            setSavedLots([]);
            return;
        }

        setIsLoading(true);
        try {
            // Fetch each lot by ID
            const lotPromises = savedLotIds.map(id =>
                campsiteService.getLotById(id).catch(() => undefined)
            );
            const lots = await Promise.all(lotPromises);

            // Filter out any that weren't found
            setSavedLots(lots.filter((lot): lot is Lot => lot !== undefined));
        } catch (error) {
            console.error('[SavedContext] Error fetching saved lots:', error);
            setSavedLots([]);
        } finally {
            setIsLoading(false);
        }
    }, [savedLotIds]);

    useEffect(() => {
        fetchSavedLots();
    }, [fetchSavedLots]);

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
        <SavedContext.Provider value={{ savedLots, savedLotIds, toggleSaved, isSaved, clearSaved, isLoading }}>
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
