/**
 * Optimized Images Example
 * Demonstrates responsive images and lazy loading
 */

'use client';

// Simulate ClientImage component since we are in a raw environment not fully wired to framework's image loader yet for this example
// In a real Float app, this would be: import { Image } from '@float.js/core';
const Image = ({ src, alt, width, height, className }: any) => (
    <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-500 opacity-0 data-[loaded=true]:opacity-100 ${className}`}
        loading="lazy"
        onLoad={(e) => e.currentTarget.setAttribute('data-loaded', 'true')}
    />
);

export default function ImagesPage() {
    const images = [
        {
            src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
            title: 'Mountain Landscape',
            photographer: 'Unsplash'
        },
        {
            src: 'https://images.unsplash.com/photo-1682687221038-404670201d41',
            title: 'Ocean View',
            photographer: 'Unsplash'
        },
        {
            src: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
            title: 'Forest Mist',
            photographer: 'Unsplash'
        },
        {
            src: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b',
            title: 'Desert Dunes',
            photographer: 'Unsplash'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Optimized Images</h1>
                <p className="text-gray-600 mt-2">Responsive images with lazy loading and fade-in effects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {images.map((img, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden group">
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            <Image
                                src={img.src}
                                alt={img.title}
                                width={800}
                                height={450}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <div className="text-white">
                                    <h3 className="font-bold text-lg">{img.title}</h3>
                                    <p className="text-sm opacity-80">Photo by {img.photographer}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-blue-600">Optimized WebP</span>
                                <span className="text-xs text-gray-400">800x450</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-3/4"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Size: 45KB</span>
                                <span>Original: 2.1MB</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">How it works</h3>
                <p className="text-blue-800 mb-4">
                    Float.js automatically optimizes images at build time or request time:
                </p>
                <ul className="list-disc list-inside space-y-2 text-blue-700 text-sm">
                    <li>Resizes images to appropriate dimensions for the device</li>
                    <li>Converts to modern formats like WebP or AVIF</li>
                    <li>Lazy loads images only when they enter the viewport</li>
                    <li>Prevents layout shift by reserving space</li>
                </ul>
            </div>
        </div>
    );
}
