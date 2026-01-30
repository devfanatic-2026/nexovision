/**
 * Multi-Step Wizard Form Example
 * Demonstrates complex form state management and validation across steps
 */

'use client';

import { useFloatForm, validators } from '@float.js/core';
import { useState } from 'react';

interface WizardData {
    // Step 1: Personal Info
    firstName: string;
    lastName: string;
    email: string;

    // Step 2: Preferences
    newsletter: boolean;
    notifications: 'email' | 'push' | 'none';
    theme: 'light' | 'dark' | 'system';

    // Step 3: Review
    acceptedTerms: boolean;
}

export default function WizardPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isComplete, setIsComplete] = useState(false);

    const form = useFloatForm<WizardData>({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            newsletter: true,
            notifications: 'email',
            theme: 'system',
            acceptedTerms: false,
        },
        onSubmit: async (values) => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Wizard Completed:', values);
            setIsComplete(true);
        },
        validateOnChange: true,
    });

    const nextStep = async () => {
        // Validate current step fields before proceeding
        let isValid = false;

        if (currentStep === 1) {
            if (!form.values.firstName || !form.values.lastName || !form.values.email) {
                form.setTouched('firstName', true);
                form.setTouched('lastName', true);
                form.setTouched('email', true);
                return;
            }
            isValid = true;
        } else if (currentStep === 2) {
            isValid = true; // Preferences are always valid in this example
        }

        if (isValid) {
            setCurrentStep(c => c + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(c => c - 1);
    };

    if (isComplete) {
        return (
            <div className="max-w-xl mx-auto text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Complete!</h2>
                <p className="text-gray-600 mb-8">Thank you for signing up. We've sent a confirmation email to {form.values.email}.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    Start Over
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Multi-Step Wizard</h1>
                <p className="text-gray-600 mt-2">Complex form state with step-by-step validation</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                    <div className={`absolute left-0 top-1/2 h-1 bg-blue-600 -z-10 transition-all duration-300`}
                        style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>

                    {[1, 2, 3].map(step => (
                        <div key={step} className={`flex flex-col items-center bg-white px-2`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {step < currentStep ? '✓' : step}
                            </div>
                            <span className="text-xs font-medium text-gray-500 mt-2">
                                {step === 1 ? 'Personal' : step === 2 ? 'Preferences' : 'Review'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={form.handleSubmit}>
                    {/* Step 1: Personal Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        {...form.register('firstName')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="John"
                                    />
                                    {form.touched.firstName && !form.values.firstName && (
                                        <p className="text-red-500 text-xs mt-1">Required</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        {...form.register('lastName')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Doe"
                                    />
                                    {form.touched.lastName && !form.values.lastName && (
                                        <p className="text-red-500 text-xs mt-1">Required</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    {...form.register('email')}
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="john@example.com"
                                />
                                {form.touched.email && !form.values.email && (
                                    <p className="text-red-500 text-xs mt-1">Required</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Preferences */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900">Preferences</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Method</label>
                                <select
                                    {...form.register('notifications')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="email">Email</option>
                                    <option value="push">Push Notifications</option>
                                    <option value="none">None</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {(['light', 'dark', 'system'] as const).map(theme => (
                                        <button
                                            key={theme}
                                            type="button"
                                            onClick={() => form.setValue('theme', theme)}
                                            className={`py-3 px-4 rounded-lg border-2 font-medium capitalize transition-all ${form.values.theme === theme
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                        >
                                            {theme}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    {...form.register('newsletter')}
                                    id="newsletter"
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="newsletter" className="text-gray-700 text-sm">
                                    Subscribe to our weekly newsletter
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-gray-900">Review & Submit</h2>

                            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Name</span>
                                    <span className="font-medium">{form.values.firstName} {form.values.lastName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-medium">{form.values.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Notifications</span>
                                    <span className="font-medium capitalize">{form.values.notifications}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Theme</span>
                                    <span className="font-medium capitalize">{form.values.theme}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    {...form.register('acceptedTerms')}
                                    id="terms"
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="terms" className="text-gray-700 text-sm">
                                    I accept the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1 || form.isSubmitting}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentStep === 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Back
                        </button>

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                Next Step
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!form.values.acceptedTerms || form.isSubmitting}
                                className={`px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-200 ${(!form.values.acceptedTerms || form.isSubmitting) && 'opacity-50 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {form.isSubmitting ? 'Registering...' : 'Complete Registration'}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* State Debug */}
            <div className="mt-8">
                <details className="bg-gray-50 rounded-lg border border-gray-200">
                    <summary className="px-4 py-2 cursor-pointer font-medium text-gray-600 hover:text-gray-900">
                        Show Form State
                    </summary>
                    <div className="p-4 border-t border-gray-200">
                        <pre className="text-xs text-gray-600 overflow-x-auto">
                            {JSON.stringify(form.values, null, 2)}
                        </pre>
                    </div>
                </details>
            </div>
        </div>
    );
}
