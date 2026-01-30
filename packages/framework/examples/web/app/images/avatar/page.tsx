/**
 * Avatar Upload Example
 * Demonstrates profile picture upload with cropping-like interface simulation
 */

'use client';

import { useState, useRef } from 'react';

export default function AvatarPage() {
    const [avatar, setAvatar] = useState<string>('https://i.pravatar.cc/300');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Avatar Upload</h1>
                <p className="text-gray-600 mt-2">Profile picture management with preview</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="relative inline-block group">
                    <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-blue-50 mx-auto mb-6">
                        <img
                            src={avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                        {/* Hover Overlay */}
                        <div
                            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <span className="text-white font-medium text-sm">Change Photo</span>
                        </div>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-6 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <h3 className="text-xl font-bold text-gray-900">Alex Morgan</h3>
                <p className="text-gray-500 mb-6">Software Engineer</p>

                <div className="space-y-4 max-w-xs mx-auto">
                    <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition">
                        Remove Photo
                    </button>
                    <p className="text-xs text-gray-400">
                        Recommended size: 400x400px. Allowed formats: JPG, PNG.
                    </p>
                </div>
            </div>
        </div>
    );
}
