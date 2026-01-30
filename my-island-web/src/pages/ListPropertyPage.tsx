import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WizardLayout } from '../components/property/wizard/WizardLayout';

// Step Components (Placeholders for now)
import { StepIntro } from '../components/property/wizard/StepIntro';
import { StepBasicInfo } from '../components/property/wizard/StepBasicInfo';
import { StepLocation } from '../components/property/wizard/StepLocation';
import { StepCapacity } from '../components/property/wizard/StepCapacity';
import { StepAmenities } from '../components/property/wizard/StepAmenities';
import { StepReview } from '../components/property/wizard/StepReview';

export type PropertyData = {
    name: string;
    type: string;
    description: string;
    address: string;
    city: string;
    capacity: number;
    allowsTents: boolean;
    allowsRVs: boolean;
    allowsGlamping: boolean;
    amenities: string[];
    pricePerNight: number;
};

const INITIAL_DATA: PropertyData = {
    name: '',
    type: 'Campsite',
    description: '',
    address: '',
    city: '',
    capacity: 20,
    allowsTents: true,
    allowsRVs: true,
    allowsGlamping: false,
    amenities: ['Water', 'Wifi'],
    pricePerNight: 25,
};

export const ListPropertyPage: React.FC = () => {
    const navigate = useNavigate();
    const { upgradeToSupplier } = useAuth();
    const [step, setStep] = useState(0); // 0 is Intro
    const [data, setData] = useState<PropertyData>(INITIAL_DATA);
    const [isLoading, setIsLoading] = useState(false);

    const updateData = (updates: Partial<PropertyData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await upgradeToSupplier();
            navigate('/supplier');
        } catch (error) {
            console.error('Failed to register property:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Render Steps
    if (step === 0) {
        return <StepIntro onStart={nextStep} />;
    }

    const totalSteps = 5;

    const renderStep = () => {
        switch (step) {
            case 1:
                return <StepBasicInfo data={data} updateData={updateData} onNext={nextStep} />;
            case 2:
                return <StepLocation data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
            case 3:
                return <StepCapacity data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
            case 4:
                return <StepAmenities data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
            case 5:
                return <StepReview data={data} onSubmit={handleSubmit} onBack={prevStep} isLoading={isLoading} />;
            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Tell us about your place";
            case 2: return "Where is it located?";
            case 3: return "How many guests can you host?";
            case 4: return "What amenities do you offer?";
            case 5: return "Review and publish";
            default: return "";
        }
    };

    const getStepSubtitle = () => {
        switch (step) {
            case 1: return "Share some basic details to get started.";
            case 2: return "Help guests find your property.";
            case 3: return "Set your capacity and lot details.";
            case 4: return "Select all the features available to guests.";
            case 5: return "Check everything is correct before going live.";
            default: return "";
        }
    };

    return (
        <WizardLayout
            currentStep={step}
            totalSteps={totalSteps}
            title={getStepTitle()}
            subtitle={getStepSubtitle()}
            onBack={prevStep}
        >
            {renderStep()}
        </WizardLayout>
    );
};
