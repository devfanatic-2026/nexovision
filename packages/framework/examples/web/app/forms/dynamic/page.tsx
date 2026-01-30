/**
 * Dynamic Fields Form Example
 * Demonstrates adding/removing fields dynamically using useFloatForm
 */

'use client';

import { useFloatForm } from '@float.js/core';
import { useState } from 'react';

interface Attendee {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface EventForm {
    eventName: string;
    date: string;
    attendees: Attendee[];
}

export default function DynamicFieldsPage() {
    const [success, setSuccess] = useState(false);

    const form = useFloatForm<EventForm>({
        initialValues: {
            eventName: '',
            date: new Date().toISOString().split('T')[0],
            attendees: [
                { id: 1, name: '', email: '', role: 'Guest' }
            ],
        },
        onSubmit: async (values) => {
            console.log('Event Created:', values);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        },
    });

    const addAttendee = () => {
        const newAttendee: Attendee = {
            id: Date.now(),
            name: '',
            email: '',
            role: 'Guest'
        };
        form.setValue('attendees', [...form.values.attendees, newAttendee]);
    };

    const removeAttendee = (index: number) => {
        if (form.values.attendees.length > 1) {
            const newAttendees = [...form.values.attendees];
            newAttendees.splice(index, 1);
            form.setValue('attendees', newAttendees);
        }
    };

    const updateAttendee = (index: number, field: keyof Attendee, value: string) => {
        const newAttendees = [...form.values.attendees];
        newAttendees[index] = { ...newAttendees[index], [field]: value };
        form.setValue('attendees', newAttendees);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Dynamic Fields</h1>
                <p className="text-gray-600 mt-2">Add and remove form fields dynamically</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                            <input
                                {...form.register('eventName')}
                                placeholder="Product Launch 2024"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                            <input
                                type="date"
                                {...form.register('date')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Attendees ({form.values.attendees.length})
                        </h3>
                        <button
                            type="button"
                            onClick={addAttendee}
                            className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 font-medium transition-colors flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Attendee
                        </button>
                    </div>

                    <div className="space-y-3">
                        {form.values.attendees.map((attendee, index) => (
                            <div
                                key={attendee.id}
                                className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl group hover:border-blue-200 transition-colors"
                            >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 text-xs font-bold mt-1">
                                    {index + 1}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                                    <input
                                        placeholder="Name"
                                        value={attendee.name}
                                        onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                                    />
                                    <input
                                        placeholder="Email"
                                        value={attendee.email}
                                        onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                                    />
                                    <select
                                        value={attendee.role}
                                        onChange={(e) => updateAttendee(index, 'role', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                                    >
                                        <option>Guest</option>
                                        <option>Speaker</option>
                                        <option>Organizer</option>
                                        <option>VIP</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeAttendee(index)}
                                    disabled={form.values.attendees.length === 1}
                                    className={`p-2 rounded-lg transition-colors ${form.values.attendees.length === 1
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={() => form.handleSubmit()}
                            className={`px-8 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all ${success ? 'bg-green-600 hover:bg-green-700' : ''
                                }`}
                        >
                            {success ? 'Event Saved!' : 'Create Event'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
                Tip: You can add unlimited attendees. The form state manages the array dynamically.
            </div>
        </div>
    );
}
