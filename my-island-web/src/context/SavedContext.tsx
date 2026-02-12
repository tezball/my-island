import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { Lot } from '../types/booking';
import { campsiteService } from '../services/campsiteService';
import { savedService } from '../services/savedService';
import { useAuth } from './AuthContext';

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

function getLocalSavedIds(): string[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function setLocalSavedIds(ids: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export const SavedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [savedLotIds, setSavedLotIds] = useState<string[]>(() => getLocalSavedIds());
    const [savedLots, setSavedLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const prevUserRef = useRef<typeof user>(undefined);
    const isMergingRef = useRef(false);

    // When user logs in: merge localStorage favorites into backend, then load from backend
    useEffect(() => {
        const prevUser = prevUserRef.current;
        prevUserRef.current = user;

        if (user && !prevUser && !isMergingRef.current) {
            // User just logged in
            isMergingRef.current = true;
            const localIds = getLocalSavedIds();

            const syncSaved = async () => {
                try {
                    // Merge local saved lots to backend
                    if (localIds.length > 0) {
                        await savedService.bulkSaveLots(localIds);
                        // Clear localStorage after successful merge
                        localStorage.removeItem(STORAGE_KEY);
                    }

                    // Load saved lots from backend
                    const backendIds = await savedService.getSavedLotIds();
                    setSavedLotIds(backendIds);
                } catch (error) {
                    console.error('[SavedContext] Error syncing saved lots:', error);
                    // Fall back to local IDs if backend fails
                    setSavedLotIds(localIds);
                } finally {
                    isMergingRef.current = false;
                }
            };

            syncSaved();
        } else if (!user && prevUser) {
            // User just logged out: reset to localStorage
            setSavedLotIds(getLocalSavedIds());
        }
    }, [user]);

    // For anonymous users: persist to localStorage whenever savedLotIds changes
    useEffect(() => {
        if (!user) {
            setLocalSavedIds(savedLotIds);
        }
    }, [savedLotIds, user]);

    // Fetch lot details when savedLotIds changes
    const fetchSavedLots = useCallback(async () => {
        if (savedLotIds.length === 0) {
            setSavedLots([]);
            return;
        }

        setIsLoading(true);
        try {
            const lotPromises = savedLotIds.map(id =>
                campsiteService.getLotById(id).catch(() => undefined)
            );
            const lots = await Promise.all(lotPromises);
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

    const toggleSaved = useCallback((lotId: string) => {
        const currentlySaved = savedLotIds.includes(lotId);

        // Optimistically update local state
        setSavedLotIds(prev => {
            if (currentlySaved) {
                return prev.filter(id => id !== lotId);
            }
            return [...prev, lotId];
        });

        // If authenticated, also update backend
        if (user) {
            if (currentlySaved) {
                savedService.unsaveLot(lotId).catch(error => {
                    console.error('[SavedContext] Error unsaving lot:', error);
                    // Revert optimistic update on failure
                    setSavedLotIds(prev => [...prev, lotId]);
                });
            } else {
                savedService.saveLot(lotId).catch(error => {
                    console.error('[SavedContext] Error saving lot:', error);
                    // Revert optimistic update on failure
                    setSavedLotIds(prev => prev.filter(id => id !== lotId));
                });
            }
        }
    }, [savedLotIds, user]);

    const isSaved = useCallback((lotId: string) => savedLotIds.includes(lotId), [savedLotIds]);

    const clearSaved = useCallback(() => {
        setSavedLotIds([]);
        if (!user) {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user]);

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
