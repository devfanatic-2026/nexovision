/**
 * Image Gallery Example
 * Demonstrates grid layout, lightbox interaction, and responsive images
 */

'use client';

import { useState } from 'react';

const galleryImages = [
    { id: 1, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', active: true },
    { id: 2, src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', active: true },
    { id: 3, src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80', active: true },
    { id: 4, src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', active: true },
    { id: 5, src: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&q=80', active: true },
    { id: 6, src: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=800&q=80', active: true },
    { id: 7, src: 'https://images.unsplash.com/photo-1501854140884-074bf86ee91c?w=800&q=80', active: true },
    { id: 8, src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80', active: true },
];

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
                <p className="text-gray-600 mt-2">Responsive grid with lightbox view using Tailwind CSS</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((img) => (
                    <div
                        key={img.id}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group relative"
                        onClick={() => setSelectedImage(img.src)}
                    >
                        <img
                            src={img.src}
                            alt={`Gallery image ${img.id}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">View</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white/50 hover:text-white p-2"
                        onClick={() => setSelectedImage(null)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <img
                        src={selectedImage}
                        alt="Full size"
                        className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
