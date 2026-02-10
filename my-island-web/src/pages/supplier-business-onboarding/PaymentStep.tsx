import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CreditCard, Check, ArrowRight } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';

interface PaymentStepProps {
  onBack: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
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
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
          <Check className="w-7 h-7 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
          Your business is live!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Choose how you'd like to get started
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pb-4">
        {/* Option 1: Free Trial (Recommended) */}
        <button
          onClick={() => navigate('/supplier')}
          disabled={isLoading}
          className="w-full text-left bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-5 hover:border-blue-400 dark:hover:border-blue-500 transition-colors group disabled:opacity-50"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg shrink-0 mt-0.5">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-[#111418] dark:text-white">Start Free Trial</h3>
                  <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  14-day free trial — Full access to all features, no credit card required.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400 dark:text-blue-500 shrink-0 mt-2 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Option 2: Subscribe Now */}
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full text-left bg-white dark:bg-[#1a2632] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-purple-400 dark:hover:border-purple-500 transition-colors group disabled:opacity-50"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0 mt-0.5">
                <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-[#111418] dark:text-white mb-1">
                  {isLoading ? 'Loading...' : 'Subscribe Now'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  €5/month — Start your subscription today.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 mt-2 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="pt-4 mt-auto space-y-3">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="w-full py-4 rounded-xl font-bold text-[#111418] dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={() => navigate('/supplier')}
          disabled={isLoading}
          className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-2 disabled:opacity-50"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};
