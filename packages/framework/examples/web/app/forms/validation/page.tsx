/**
 * Advanced Form Validation Example
 * Demonstrates complex validation rules, async validation, and error handling
 */

'use client';

import { useFloatForm, validators } from '@float.js/core';
import { useState } from 'react';

interface RegistrationForm {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    age: number;
    website: string;
}

export default function ValidationPage() {
    const [asyncChecking, setAsyncChecking] = useState(false);

    const form = useFloatForm<RegistrationForm>({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            age: 18,
            website: '',
        },
        onSubmit: async (values) => {
            console.log('Registration Valid:', values);
            alert('Form is valid and submitted!');
        },
        validateOnChange: true,
    });

    // Custom async validator for username availability
    const checkUsername = async (username: string) => {
        if (!username) return;
        setAsyncChecking(true);
        // Simulate API check
        await new Promise(resolve => setTimeout(resolve, 800));
        setAsyncChecking(false);

        if (username.toLowerCase() === 'admin') {
            form.setError('username', 'Username "admin" is taken');
        } else {
            form.setError('username', undefined); // Clear error if available
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Advanced Validation</h1>
                <p className="text-gray-600 mt-2">Custom rules, async checks, and field dependencies</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={form.handleSubmit} className="space-y-6">

                    {/* Username - Async Validation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <div className="relative">
                            <input
                                {...form.register('username')}
                                onBlur={(e) => {
                                    form.register('username').onBlur(e);
                                    checkUsername(e.target.value);
                                }}
                                className={`w-full px-4 py-2 border rounded-lg outline-none ${form.errors.username ? 'border-red-500 bg-red-50' :
                                        form.values.username && !asyncChecking ? 'border-green-500 bg-green-50' : 'border-gray-300'
                                    }`}
                                placeholder="Unique username"
                            />
                            {asyncChecking && (
                                <div className="absolute right-3 top-2.5">
                                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                        {form.errors.username && (
                            <p className="text-red-500 text-sm mt-1">{form.errors.username}</p>
                        )}
                        {!form.errors.username && form.values.username && !asyncChecking && (
                            <p className="text-green-600 text-sm mt-1">Username available!</p>
                        )}
                    </div>

                    {/* Email - Pattern Validation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            {...form.register('email')}
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="valid@email.com"
                        />
                    </div>

                    {/* Password - Strength Indicator (Visual only for this example, logic doable in validator) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            {...form.register('password')}
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="h-1 w-full bg-gray-200 mt-2 rounded overflow-hidden">
                            <div className={`h-full transition-all duration-300 ${form.values.password.length > 8 ? 'w-full bg-green-500' :
                                    form.values.password.length > 4 ? 'w-1/2 bg-yellow-500' : 'w-1/4 bg-red-500'
                                }`}></div>
                        </div>
                    </div>

                    {/* Confirm Password - Match Validation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            {...form.register('confirmPassword')}
                            type="password"
                            className={`w-full px-4 py-2 border rounded-lg outline-none ${form.values.confirmPassword && form.values.password !== form.values.confirmPassword
                                    ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                                }`}
                        />
                        {form.values.confirmPassword && form.values.password !== form.values.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Age - Numeric Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age (18+)</label>
                            <input
                                {...form.register('age')}
                                type="number"
                                min="18"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Website - URL Pattern */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <input
                                {...form.register('website')}
                                placeholder="https://"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={form.isSubmitting || !form.isValid || asyncChecking}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${form.isSubmitting || !form.isValid || asyncChecking
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
