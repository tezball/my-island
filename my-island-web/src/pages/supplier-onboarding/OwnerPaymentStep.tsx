import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Shield, Check } from 'lucide-react';
import { ownerSubscriptionApi } from '../../services/subscriptionApi';
import { SubscriptionFormModal } from '../../components/subscription/SubscriptionForm';

interface OwnerPaymentStepProps {
  onBack: () => void;
}

export const OwnerPaymentStep: React.FC<OwnerPaymentStepProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
          Activate your subscription
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Start hosting campers for just €15/month
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-4">
        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold">€15</span>
            <span className="text-xl">/month</span>
          </div>
          <p className="text-emerald-100 text-sm mb-4">
            Professional hosting plan
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Unlimited lot listings
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Booking management dashboard
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Calendar availability sync
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Guest messaging
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Performance analytics
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
      </div>

      <div className="pt-4 mt-auto space-y-3">
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-4 rounded-xl font-bold text-[#111418] dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex-1 py-4 rounded-xl font-bold text-white bg-primary hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Continue to Payment
          </button>
        </div>
        <button
          onClick={() => navigate('/owner')}
          className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-2"
        >
          Skip for now, I'll subscribe later
        </button>
      </div>

      <SubscriptionFormModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
          navigate('/owner');
        }}
        createSetupIntent={ownerSubscriptionApi.createSetupIntent}
        confirmSubscription={ownerSubscriptionApi.confirmSubscription}
        pricePerMonth="€15"
        planName="Owner Plan"
      />
    </div>
  );
};
