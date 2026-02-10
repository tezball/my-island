import React, { useState, useEffect } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { SetupIntentResponse, SubscriptionStatus } from '../../services/subscriptionApi';

interface SubscriptionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (subscription: SubscriptionStatus) => void;
    createSetupIntent: () => Promise<SetupIntentResponse>;
    confirmSubscription: (paymentMethodId: string) => Promise<SubscriptionStatus>;
    pricePerMonth: string;
    planName: string;
}

export const SubscriptionFormModal: React.FC<SubscriptionFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    createSetupIntent,
    confirmSubscription,
    pricePerMonth,
    planName,
}) => {
    const [setupIntent, setSetupIntent] = useState<SetupIntentResponse | null>(null);
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadSetupIntent();
        }
    }, [isOpen]);

    const loadSetupIntent = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const intent = await createSetupIntent();
            setSetupIntent(intent);
            if (!intent.devMode && intent.publishableKey) {
                setStripePromise(loadStripe(intent.publishableKey));
            }
        } catch (err) {
            console.error('Failed to create setup intent:', err);
            setError('Failed to initialize payment form. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

                <div className="relative bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl w-full max-w-md p-6 z-10">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                            <CreditCard className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                            Subscribe to {planName}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {pricePerMonth}/month
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                            <button
                                onClick={loadSetupIntent}
                                className="mt-4 px-4 py-2 text-sm font-medium text-primary hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    ) : setupIntent?.devMode ? (
                        <DevModeForm
                            onConfirm={async () => {
                                const result = await confirmSubscription('pm_dev_test');
                                onSuccess(result);
                            }}
                            onClose={onClose}
                        />
                    ) : stripePromise && setupIntent ? (
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret: setupIntent.clientSecret,
                                appearance: {
                                    theme: 'stripe',
                                    variables: {
                                        colorPrimary: '#059669',
                                        borderRadius: '8px',
                                    },
                                },
                            }}
                        >
                            <PaymentForm
                                clientSecret={setupIntent.clientSecret}
                                onSuccess={async (paymentMethodId) => {
                                    const result = await confirmSubscription(paymentMethodId);
                                    onSuccess(result);
                                }}
                                onClose={onClose}
                            />
                        </Elements>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

// Dev mode form with test card pre-filled
const DevModeForm: React.FC<{
    onConfirm: () => Promise<void>;
    onClose: () => void;
}> = ({ onConfirm, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onConfirm();
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Failed to confirm subscription:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 dark:text-green-400 font-medium">
                    Subscription activated!
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium">Development Mode</p>
                <p className="text-xs mt-1">Test card details pre-filled below.</p>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Number
                    </label>
                    <input
                        type="text"
                        value="4242 4242 4242 4242"
                        readOnly
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Expiry
                        </label>
                        <input
                            type="text"
                            value="12/28"
                            readOnly
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            CVC
                        </label>
                        <input
                            type="text"
                            value="123"
                            readOnly
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Subscribe'
                    )}
                </button>
            </div>
        </form>
    );
};

// Real Stripe payment form
const PaymentForm: React.FC<{
    clientSecret: string;
    onSuccess: (paymentMethodId: string) => Promise<void>;
    onClose: () => void;
}> = ({ clientSecret, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Card element not found');
            setIsSubmitting(false);
            return;
        }

        try {
            // Confirm the setup intent and get the payment method
            const { error: setupError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (setupError) {
                setError(setupError.message || 'Payment setup failed');
                setIsSubmitting(false);
                return;
            }

            if (setupIntent?.payment_method) {
                const paymentMethodId = typeof setupIntent.payment_method === 'string'
                    ? setupIntent.payment_method
                    : setupIntent.payment_method.id;

                await onSuccess(paymentMethodId);
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('Failed to process payment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 dark:text-green-400 font-medium">
                    Subscription activated!
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Details
                </label>
                <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                    <CardElement
                        options={{
                            hidePostalCode: true,
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#374151',
                                    '::placeholder': {
                                        color: '#9CA3AF',
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || !stripe}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Subscribe'
                    )}
                </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Your card will be charged monthly. Cancel anytime.
            </p>
        </form>
    );
};
