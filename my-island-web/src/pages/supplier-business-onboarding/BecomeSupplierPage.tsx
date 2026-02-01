import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SupplierBusinessOnboardingProvider, useSupplierBusinessOnboarding } from '../../context/SupplierBusinessOnboardingContext';
import { OnboardingProgress } from '../../components/supplier-onboarding';
import { BusinessTypeStep } from './BusinessTypeStep';
import { BusinessDetailsStep } from './BusinessDetailsStep';
import { BusinessReviewStep } from './BusinessReviewStep';
import { PaymentStep } from './PaymentStep';
import { supplierService } from '../../services/supplierService';

const TOTAL_STEPS = 4;
const SUPPLIER_STEP_LABELS = ['Business Type', 'Details', 'Review', 'Payment'];

const BecomeSupplierContent: React.FC = () => {
    const { user, isAuthenticated, upgradeToSupplier } = useAuth();
    const { state } = useSupplierBusinessOnboarding();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleCreateBusiness = async () => {
        if (!user) {
            return;
        }

        setIsLoading(true);
        try {
            await supplierService.createSupplierBusiness({
                userId: user.id,
                businessName: state.businessName,
                businessType: state.businessType,
                description: state.description,
                contactEmail: state.contactEmail || user.email,
                contactPhone: state.contactPhone,
                website: state.website,
                logoUrl: state.logoUrl,
                county: state.county,
                town: state.town,
                servicesOffered: state.servicesOffered,
            });

            await upgradeToSupplier();
            // Don't reset state yet - go to payment step
            nextStep();
        } catch (error) {
            console.error('Failed to create supplier business:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <BusinessTypeStep onNext={nextStep} />;
            case 2:
                return <BusinessDetailsStep onNext={nextStep} onBack={prevStep} />;
            case 3:
                return <BusinessReviewStep onBack={prevStep} onSubmit={handleCreateBusiness} isLoading={isLoading} />;
            case 4:
                return <PaymentStep onBack={prevStep} />;
            default:
                return null;
        }
    };

    return (
        <div className="relative mx-auto flex h-screen max-w-2xl w-full flex-col overflow-hidden bg-background-light dark:bg-[#101922]">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 shrink-0 bg-white dark:bg-[#1a2632] border-b border-gray-100 dark:border-white/5">
                <Link
                    to="/"
                    className="flex size-10 items-center justify-center rounded-full text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </Link>

                <h2 className="text-[#111418] dark:text-white text-base font-bold leading-tight tracking-[-0.015em]">
                    Become a Supplier
                </h2>

                {isAuthenticated ? (
                    <div className="size-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                                {user?.name?.charAt(0) || '?'}
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/signin"
                        state={{ from: '/become-a-supplier' }}
                        className="text-sm font-semibold text-primary hover:underline"
                    >
                        Sign in
                    </Link>
                )}
            </header>

            {/* Progress */}
            <div className="px-4 py-3 shrink-0 bg-white dark:bg-[#1a2632]">
                <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} labels={SUPPLIER_STEP_LABELS} />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-4">
                {renderStep()}
            </main>
        </div>
    );
};

export const BecomeSupplierPage: React.FC = () => {
    return (
        <SupplierBusinessOnboardingProvider>
            <BecomeSupplierContent />
        </SupplierBusinessOnboardingProvider>
    );
};
