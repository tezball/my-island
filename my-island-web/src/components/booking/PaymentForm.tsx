import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { paymentService } from '../../services/paymentService';
import type { PaymentIntentResponse } from '../../types/booking';

interface PaymentFormProps {
    bookingId: string;
    onPaymentSuccess: () => void;
    onPaymentError: (error: string) => void;
    onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
    bookingId,
    onPaymentSuccess,
    onPaymentError,
    onCancel,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const [elements, setElements] = useState<StripeElements | null>(null);
    const [cardComplete, setCardComplete] = useState(false);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Create payment intent
                const intent = await paymentService.createPaymentIntent(bookingId);
                setPaymentIntent(intent);

                // In dev mode, skip Stripe initialization
                if (intent.devMode) {
                    setIsLoading(false);
                    return;
                }

                // Initialize Stripe
                const stripeInstance = await loadStripe(intent.publishableKey);
                if (!stripeInstance) {
                    throw new Error('Failed to load Stripe');
                }
                setStripe(stripeInstance);

                // Create Elements
                const elementsInstance = stripeInstance.elements({
                    clientSecret: intent.clientSecret,
                });
                setElements(elementsInstance);

                setIsLoading(false);
            } catch (err) {
                console.error('Failed to initialize payment:', err);
                setError(err instanceof Error ? err.message : 'Failed to initialize payment');
                setIsLoading(false);
            }
        };

        initializePayment();
    }, [bookingId]);

    // Mount card element after elements are ready
    useEffect(() => {
        if (!elements || !paymentIntent || paymentIntent.devMode) return;

        const cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#111418',
                    '::placeholder': {
                        color: '#9ca3af',
                    },
                },
                invalid: {
                    color: '#dc2626',
                },
            },
        });

        const container = document.getElementById('card-element');
        if (container) {
            cardElement.mount(container);
            cardElement.on('change', (event) => {
                setCardComplete(event.complete);
                if (event.error) {
                    setError(event.error.message);
                } else {
                    setError(null);
                }
            });
        }

        return () => {
            cardElement.unmount();
        };
    }, [elements, paymentIntent]);

    const handleDevModeSubmit = async () => {
        setIsProcessing(true);
        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Notify backend of simulated payment success
            await paymentService.simulatePaymentSuccess(bookingId);
            setIsProcessing(false);
            onPaymentSuccess();
        } catch (err) {
            console.error('Dev mode payment simulation failed:', err);
            setError(err instanceof Error ? err.message : 'Payment simulation failed');
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!paymentIntent) return;

        // Dev mode - simulate payment
        if (paymentIntent.devMode) {
            await handleDevModeSubmit();
            return;
        }

        if (!stripe || !elements) {
            setError('Payment system not initialized');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const cardElement = elements.getElement('card') as StripeCardElement;
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            const { error: confirmError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
                paymentIntent.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                }
            );

            if (confirmError) {
                throw new Error(confirmError.message || 'Payment failed');
            }

            if (confirmedIntent?.status === 'requires_capture') {
                // Payment authorized successfully (manual capture mode)
                onPaymentSuccess();
            } else if (confirmedIntent?.status === 'succeeded') {
                // Should not happen with manual capture, but handle it
                onPaymentSuccess();
            } else {
                throw new Error('Unexpected payment status: ' + confirmedIntent?.status);
            }
        } catch (err) {
            console.error('Payment failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'Payment failed';
            setError(errorMessage);
            onPaymentError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Preparing payment...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount display */}
            {paymentIntent && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Amount to authorize</span>
                        <span className="text-xl font-bold text-primary">€{paymentIntent.amount.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Your card will be authorized but not charged until the owner confirms your booking.
                    </p>
                </div>
            )}

            {/* Dev mode indicator */}
            {paymentIntent?.devMode && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                        <span className="material-symbols-outlined text-sm">science</span>
                        <span className="text-sm font-medium">Development Mode</span>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                        Payment will be simulated. No real charge will occur.
                    </p>
                </div>
            )}

            {/* Card element container (only shown in non-dev mode) */}
            {!paymentIntent?.devMode && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Details
                    </label>
                    <div
                        id="card-element"
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    />
                </div>
            )}

            {/* Error display */}
            {error && (
                <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isProcessing || (!paymentIntent?.devMode && !cardComplete)}
                    className="flex-1 bg-primary hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md"
                >
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                            Processing...
                        </span>
                    ) : (
                        'Authorize Payment'
                    )}
                </button>
            </div>
        </form>
    );
};
