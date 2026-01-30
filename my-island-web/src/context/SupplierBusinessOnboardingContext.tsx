import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SupplierBusinessState {
    businessName: string;
    businessType: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    logoUrl: string;
    county: string;
    town: string;
    servicesOffered: string[];
}

const initialState: SupplierBusinessState = {
    businessName: '',
    businessType: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    logoUrl: '',
    county: '',
    town: '',
    servicesOffered: [],
};

interface SupplierBusinessOnboardingContextType {
    state: SupplierBusinessState;
    updateState: (updates: Partial<SupplierBusinessState>) => void;
    resetState: () => void;
}

const SupplierBusinessOnboardingContext = createContext<SupplierBusinessOnboardingContextType | undefined>(undefined);

const STORAGE_KEY = 'supplier-business-onboarding';

export const SupplierBusinessOnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<SupplierBusinessState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : initialState;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const updateState = (updates: Partial<SupplierBusinessState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const resetState = () => {
        setState(initialState);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <SupplierBusinessOnboardingContext.Provider value={{ state, updateState, resetState }}>
            {children}
        </SupplierBusinessOnboardingContext.Provider>
    );
};

export const useSupplierBusinessOnboarding = () => {
    const context = useContext(SupplierBusinessOnboardingContext);
    if (!context) {
        throw new Error('useSupplierBusinessOnboarding must be used within a SupplierBusinessOnboardingProvider');
    }
    return context;
};
