import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

interface StripeContextType {
    publishableKey: string | null;
    devMode: boolean;
    isLoading: boolean;
}

const StripeContext = createContext<StripeContextType>({
    publishableKey: null,
    devMode: false,
    isLoading: true,
});

export const useStripeConfig = () => useContext(StripeContext);

interface StripeProviderProps {
    children: ReactNode;
    publishableKey: string;
    devMode?: boolean;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({
    children,
    publishableKey,
    devMode = false,
}) => {
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

    useEffect(() => {
        if (publishableKey && !devMode) {
            setStripePromise(loadStripe(publishableKey));
        }
    }, [publishableKey, devMode]);

    return (
        <StripeContext.Provider value={{ publishableKey, devMode, isLoading: false }}>
            {devMode ? (
                // In dev mode, don't wrap with Elements as we won't use real Stripe
                children
            ) : stripePromise ? (
                <Elements
                    stripe={stripePromise}
                    options={{
                        appearance: {
                            theme: 'stripe',
                            variables: {
                                colorPrimary: '#059669',
                                borderRadius: '8px',
                            },
                        },
                    }}
                >
                    {children}
                </Elements>
            ) : (
                children
            )}
        </StripeContext.Provider>
    );
};

// Wrapper component for when we need Elements around a specific form
interface StripeElementsWrapperProps {
    children: ReactNode;
    clientSecret?: string;
}

export const StripeElementsWrapper: React.FC<StripeElementsWrapperProps> = ({
    children,
    clientSecret,
}) => {
    const { publishableKey, devMode } = useStripeConfig();
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

    useEffect(() => {
        if (publishableKey && !devMode) {
            setStripePromise(loadStripe(publishableKey));
        }
    }, [publishableKey, devMode]);

    if (devMode) {
        return <>{children}</>;
    }

    if (!stripePromise) {
        return <div>Loading payment system...</div>;
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#059669',
                        borderRadius: '8px',
                    },
                },
            }}
        >
            {children}
        </Elements>
    );
};
