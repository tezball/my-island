import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AccommodationType = 'tent' | 'touring' | 'glamping' | 'cabin' | 'mobile-home';

export interface LotCounts {
    tent: number;
    touring: number;
    glamping: number;
    cabin: number;
    'mobile-home': number;
}

export interface OnboardingState {
    selectedAccommodationTypes: AccommodationType[];
    propertyName: string;
    county: string;
    town: string;
    description: string;
    coverImageUrl: string;
    lotCounts: LotCounts;
    campsiteAmenities: string[];
    lotAmenities: string[];
    basePricePerNight: number;
    typePricing?: Record<string, number>;
}

const INITIAL_STATE: OnboardingState = {
    selectedAccommodationTypes: [],
    propertyName: '',
    county: '',
    town: '',
    description: '',
    coverImageUrl: '',
    lotCounts: {
        tent: 0,
        touring: 0,
        glamping: 0,
        cabin: 0,
        'mobile-home': 0,
    },
    campsiteAmenities: [],
    lotAmenities: [],
    basePricePerNight: 25,
    typePricing: undefined,
};

const STORAGE_KEY = 'supplier-onboarding-state';

interface SupplierOnboardingContextType {
    state: OnboardingState;
    updateState: (updates: Partial<OnboardingState>) => void;
    resetState: () => void;
    totalLots: number;
}

const SupplierOnboardingContext = createContext<SupplierOnboardingContextType | undefined>(undefined);

export const SupplierOnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<OnboardingState>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Migration: convert old propertyType to new selectedAccommodationTypes
                if (parsed.propertyType && !parsed.selectedAccommodationTypes) {
                    parsed.selectedAccommodationTypes = [];
                    delete parsed.propertyType;
                }
                return { ...INITIAL_STATE, ...parsed };
            }
        } catch (error) {
            console.error('Failed to parse stored onboarding state:', error);
        }
        return INITIAL_STATE;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const updateState = useCallback((updates: Partial<OnboardingState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const resetState = useCallback(() => {
        setState(INITIAL_STATE);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const totalLots = state.lotCounts.tent + state.lotCounts.touring + state.lotCounts.glamping + state.lotCounts.cabin + state.lotCounts['mobile-home'];

    return (
        <SupplierOnboardingContext.Provider value={{ state, updateState, resetState, totalLots }}>
            {children}
        </SupplierOnboardingContext.Provider>
    );
};

export const useSupplierOnboarding = () => {
    const context = useContext(SupplierOnboardingContext);
    if (context === undefined) {
        throw new Error('useSupplierOnboarding must be used within a SupplierOnboardingProvider');
    }
    return context;
};
