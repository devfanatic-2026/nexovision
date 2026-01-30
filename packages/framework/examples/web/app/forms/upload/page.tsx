/**
 * File Upload Example
 * Demonstrates simulated file upload with preview and drag & drop zone
 */

'use client';

import { useFloatForm } from '@float.js/core';
import { useState, useRef } from 'react';

interface UploadForm {
    title: string;
    description: string;
    files: File[];
}

export default function FileUploadPage() {
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

    const form = useFloatForm<UploadForm>({
        initialValues: {
            title: '',
            description: '',
            files: [],
        },
        onSubmit: async (values) => {
            setUploadStatus('uploading');
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Uploaded files:', values.files);
            setUploadStatus('success');
            setTimeout(() => setUploadStatus('idle'), 3000);
            setPreviews([]);
            form.reset();
        },
    });

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files);
        const validFiles = newFiles.filter(file => file.type.startsWith('image/'));

        // Create previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        form.setValue('files', [...form.values.files, ...validFiles]);
    };

    const removeFile = (index: number) => {
        const newFiles = [...form.values.files];
        newFiles.splice(index, 1);
        form.setValue('files', newFiles);

        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">File Upload</h1>
                <p className="text-gray-600 mt-2">Drag & drop zone with image preview and metadata form</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {uploadStatus === 'success' && (
                    <div className="bg-green-50 p-4 border-b border-green-100 flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Files uploaded successfully!
                    </div>
                )}

                <div className="p-8">
                    <form onSubmit={form.handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Collection Title</label>
                            <input
                                {...form.register('title')}
                                placeholder="My Holiday Photos"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Drop Zone */}
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${isDragging
                                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                                }`}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e.target.files)}
                            />
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Click or Drag images here</h3>
                            <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG, GIF up to 10MB</p>
                        </div>

                        {/* Previews */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in">
                                {previews.map((preview, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                                            {form.values.files[index]?.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={form.values.files.length === 0 || form.isSubmitting}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${form.values.files.length === 0 || form.isSubmitting
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                                }`}
                        >
                            {form.isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading {form.values.files.length} files...
                                </>
                            ) : (
                                `Upload ${form.values.files.length > 0 ? `${form.values.files.length} Files` : ''}`
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
