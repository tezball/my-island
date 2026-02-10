import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PlanCard: React.FC<{
    title: string;
    price: string;
    period: string;
    color: string;
    subtitle?: string;
    freeFeatures: string[];
    paidFeatures: string[];
}> = ({ title, price, period, color, subtitle, freeFeatures, paidFeatures }) => (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex-1">
        <div className={`${color} px-6 py-5 text-white`}>
            <h3 className="text-lg font-bold">{title}</h3>
            <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold">{price}</span>
                <span className="text-sm opacity-80">/{period}</span>
            </div>
            {subtitle && <p className="text-sm opacity-90 mt-1">{subtitle}</p>}
        </div>
        <div className="p-6 space-y-6">
            <div>
                <h4 className="text-sm font-semibold text-[#111418] dark:text-white mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    Free Features
                </h4>
                <ul className="space-y-2">
                    {freeFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-green-500 text-base mt-0.5">check</span>
                            {f}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-[#111418] dark:text-white mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-lg">star</span>
                    Paid Features
                </h4>
                <ul className="space-y-2">
                    {paidFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-primary text-base mt-0.5">check</span>
                            {f}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left"
            >
                <span className="font-medium text-[#111418] dark:text-white pr-4">{question}</span>
                <span className="material-symbols-outlined text-gray-400 shrink-0 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : undefined }}>
                    expand_more
                </span>
            </button>
            {isOpen && (
                <div className="pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
};

export const FaqPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-[#111418] dark:text-white mb-3">
                    Frequently Asked Questions
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Everything you need to know about listing your property or business on My Island.
                </p>
            </div>

            {/* Pricing Plans */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6 text-center">Pricing Plans</h2>
                <div className="flex flex-col md:flex-row gap-6">
                    <PlanCard
                        title="Owner Plan"
                        price="€15"
                        period="month"
                        color="bg-primary"
                        subtitle="Includes 14-day free trial"
                        freeFeatures={[
                            'List your property',
                            'Manage lots',
                            'Edit property details',
                            'Guest reviews & responses',
                            'Access settings & billing',
                        ]}
                        paidFeatures={[
                            'Accept online bookings',
                            'Create manual bookings',
                            'Calendar & today view',
                            'Dashboard analytics',
                            'Seasonal pricing rules',
                        ]}
                    />
                    <PlanCard
                        title="Supplier Plan"
                        price="€5"
                        period="month"
                        color="bg-lime-600"
                        subtitle="Includes 14-day free trial"
                        freeFeatures={[
                            'Business profile',
                            'Dashboard overview',
                            'Redeem vouchers',
                            'View reviews',
                            'Access settings & billing',
                        ]}
                        paidFeatures={[
                            'Create promotional offers',
                            'Manage active offers',
                            'Activate & deactivate offers',
                        ]}
                    />
                </div>
            </section>

            {/* General FAQ */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6 text-center">General Questions</h2>
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 px-6">
                    <FaqItem
                        question="What is My Island?"
                        answer="My Island is a camping and glamping booking platform for Ireland. It connects property owners with guests looking for unique outdoor stays, and features a local supplier marketplace where businesses can promote their products and services to visitors."
                    />
                    <FaqItem
                        question="How do I list my property?"
                        answer="Getting started is easy! Sign up for a free account, then visit the 'Become a Host' page to complete the onboarding process. You can list your property and add lots for free. To start accepting bookings, you'll need to subscribe to the Owner Plan."
                    />
                    <FaqItem
                        question="Can I use the platform without a subscription?"
                        answer="Yes! When you sign up as an owner or supplier, you get a 14-day free trial with full access to all premium features — no credit card required. After the trial, core features remain free. Owners can list their property and manage lots, while suppliers can set up their profile and redeem vouchers. Premium features like booking management and offer creation require a subscription."
                    />
                    <FaqItem
                        question="What payment methods do you accept?"
                        answer="We accept all major credit and debit cards through our secure payment processor Stripe. You can manage your payment methods in your account settings."
                    />
                    <FaqItem
                        question="Can I cancel my subscription?"
                        answer="Absolutely. You can cancel your subscription at any time from your settings page. Your subscription will remain active until the end of your current billing period, and you won't be charged again."
                    />
                    <FaqItem
                        question="What happens to my data if I cancel?"
                        answer="Your property listing, lots, and all associated data remain intact. You simply lose access to premium features like booking management and analytics. If you resubscribe later, everything will be right where you left it."
                    />
                    <FaqItem
                        question="How does the marketplace work?"
                        answer="Local suppliers (restaurants, activity providers, gear rental shops, etc.) can create promotional offers that are shown to guests staying at nearby campsites. Guests receive voucher codes with their booking confirmation which they can redeem at participating suppliers."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="text-center">
                <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4">Ready to get started?</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/become-a-host"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">cottage</span>
                        Become a Host
                    </Link>
                    <Link
                        to="/become-a-supplier"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">storefront</span>
                        Become a Supplier
                    </Link>
                </div>
            </section>
        </div>
    );
};
