/**
 * Basic Login Form Example
 * Demonstrates useFloatForm with validation
 */

'use client';

import { useFloatForm, useFloatState, validators } from '@float.js/core';

interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export default function LoginPage() {
    // Vibe-ready state with explicit identity
    const [successMessage, setSuccessMessage] = useFloatState('login-success', '');

    const form = useFloatForm<LoginFormData>({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        onSubmit: async (values) => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccessMessage(`✅ Logged in as: ${values.email}`);
            console.log('Form submitted:', values);
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    return (
        <div className="max-w-md mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Basic Login Form</h1>
                <p className="text-gray-600 mt-2">Simple login form with email validation</p>
            </div>

            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800">{successMessage}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={form.handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            {...form.register('email')}
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${form.errors.email && form.touched.email
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {form.errors.email && form.touched.email && (
                            <p className="text-red-600 text-sm mt-1">{form.errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            {...form.register('password')}
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${form.errors.password && form.touched.password
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {form.errors.password && form.touched.password && (
                            <p className="text-red-600 text-sm mt-1">{form.errors.password}</p>
                        )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            {...form.register('rememberMe')}
                            type="checkbox"
                            id="rememberMe"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={form.isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${form.isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {form.isSubmitting ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                {/* Form State Debug */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Form State</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono space-y-1">
                        <div><span className="text-gray-600">isDirty:</span> <span className={form.isDirty ? 'text-green-600' : 'text-gray-400'}>{String(form.isDirty)}</span></div>
                        <div><span className="text-gray-600">isValid:</span> <span className={form.isValid ? 'text-green-600' : 'text-red-600'}>{String(form.isValid)}</span></div>
                        <div><span className="text-gray-600">isSubmitting:</span> <span className={form.isSubmitting ? 'text-blue-600' : 'text-gray-400'}>{String(form.isSubmitting)}</span></div>
                        <div className="pt-2 border-t border-gray-300 mt-2">
                            <div className="text-gray-600 mb-1">Values:</div>
                            <pre className="text-xs">{JSON.stringify(form.values, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 rounded-xl p-6 mt-8 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                    {`import { useFloatForm } from '@float.js/core';

const form = useFloatForm({
  initialValues: { email: '', password: '', rememberMe: false },
  onSubmit: async (values) => {
    console.log('Submitted:', values);
  },
  validateOnChange: true,
  validateOnBlur: true,
});

// In your JSX:
<input {...form.register('email')} />
{form.errors.email && <p>{form.errors.email}</p>}`}
                </pre>
            </div>
        </div>
    );
}
