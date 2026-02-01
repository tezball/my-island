import React, { useState } from 'react';
import { CreditCard, Shield, Check } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';

interface PaymentStepProps {
  onBack: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinueToPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { checkoutUrl } = await subscriptionService.createCheckoutSession();
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Failed to create checkout session:', err);
      setError('Failed to start payment process. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
          Activate your subscription
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Start reaching campers for just €1/month
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-4">
        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold">€1</span>
            <span className="text-xl">/month</span>
          </div>
          <p className="text-purple-100 text-sm mb-4">
            Simple, transparent pricing
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Unlimited offers and promotions
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Featured in local campsite areas
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Real-time claim tracking
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              QR code redemption system
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Cancel anytime
            </li>
          </ul>
        </div>

        {/* Security Info */}
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-[#111418] dark:text-white text-sm mb-1">
                Secure payment
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Powered by Stripe. Your payment details are encrypted and secure. Cancel your subscription anytime from your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <h3 className="font-bold text-[#111418] dark:text-white text-sm mb-3">
            Accepted payment methods
          </h3>
          <div className="flex gap-2">
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400">
              Visa
            </div>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400">
              Mastercard
            </div>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400">
              American Express
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="pt-4 mt-auto flex gap-3">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-4 rounded-xl font-bold text-[#111418] dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleContinueToPayment}
          disabled={isLoading}
          className="flex-1 py-4 rounded-xl font-bold text-white bg-purple-500 hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
              Loading...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Continue to Payment
            </>
          )}
        </button>
      </div>
    </div>
  );
};
