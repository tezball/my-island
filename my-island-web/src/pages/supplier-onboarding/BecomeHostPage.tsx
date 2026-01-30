import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SupplierOnboardingProvider, useSupplierOnboarding } from '../../context/SupplierOnboardingContext';
import { OnboardingProgress } from '../../components/supplier-onboarding';
import { PropertyTypeStep } from './PropertyTypeStep';
import { PropertyDetailsStep } from './PropertyDetailsStep';
import { LotConfigurationStep } from './LotConfigurationStep';
import { AmenitiesPricingStep } from './AmenitiesPricingStep';
import { ReviewLaunchStep } from './ReviewLaunchStep';
import { supplierService } from '../../services/supplierService';

const TOTAL_STEPS = 5;

const BecomeHostContent: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, upgradeToOwner } = useAuth();
    const { state, resetState } = useSupplierOnboarding();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    // Derive property type from selected accommodation types
    const getPropertyType = () => {
        const types = state.selectedAccommodationTypes;
        if (types.length === 0) return 'campsite';
        if (types.length > 1) return 'mixed';
        if (types.includes('tent')) return 'campsite';
        if (types.includes('glamping')) return 'glamping';
        if (types.includes('rv')) return 'caravan-park';
        return 'campsite';
    };

    const handleSubmit = async () => {
        if (!user) {
            navigate('/signin', { state: { from: '/become-a-host' } });
            return;
        }

        setIsLoading(true);
        try {
            await supplierService.createProperty({
                userId: user.id,
                propertyName: state.propertyName,
                county: state.county,
                town: state.town,
                description: state.description,
                coverImageUrl: state.coverImageUrl,
                propertyType: getPropertyType(),
            });

            await supplierService.createBulkLots({
                userId: user.id,
                lotCounts: state.lotCounts,
                campsiteAmenities: state.campsiteAmenities,
                lotAmenities: state.lotAmenities,
                basePricePerNight: state.basePricePerNight,
                typePricing: state.typePricing,
            });

            await upgradeToOwner();
            resetState();
            navigate('/owner');
        } catch (error) {
            console.error('Failed to create property:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <PropertyTypeStep onNext={nextStep} />;
            case 2:
                return <PropertyDetailsStep onNext={nextStep} onBack={prevStep} />;
            case 3:
                return <LotConfigurationStep onNext={nextStep} onBack={prevStep} />;
            case 4:
                return <AmenitiesPricingStep onNext={nextStep} onBack={prevStep} />;
            case 5:
                return <ReviewLaunchStep onBack={prevStep} onSubmit={handleSubmit} isLoading={isLoading} />;
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
                    Become a Host
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
                        state={{ from: '/become-a-host' }}
                        className="text-sm font-semibold text-primary hover:underline"
                    >
                        Sign in
                    </Link>
                )}
            </header>

            {/* Progress */}
            <div className="px-4 py-3 shrink-0 bg-white dark:bg-[#1a2632]">
                <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-4">
                {renderStep()}
            </main>
        </div>
    );
};

export const BecomeHostPage: React.FC = () => {
    return (
        <SupplierOnboardingProvider>
            <BecomeHostContent />
        </SupplierOnboardingProvider>
    );
};
