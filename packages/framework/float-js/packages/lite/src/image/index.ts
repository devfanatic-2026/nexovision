/**
 * Float.js Image Optimization (Lite / Client)
 * Client-side utilities for image loading
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ImageConfig {
  /** Supported image widths for responsive images */
  deviceSizes: number[];
  /** Smaller sizes for use with next/image */
  imageSizes: number[];
  /** Supported output formats */
  formats: ImageFormat[];
  /** Quality for lossy formats (1-100) */
  quality: number;
  /** Base path for images */
  basePath: string;
  /** Remote image domains allowed */
  domains: string[];
  /** Minimum cache TTL in seconds */
  minimumCacheTTL: number;
  /** Disable static image imports */
  disableStaticImages: boolean;
  /** Enable AVIF format (experimental) */
  avif: boolean;
}

export type ImageFormat = 'webp' | 'avif' | 'jpeg' | 'png' | 'gif' | 'svg';

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | 'data:image/...';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  style?: Record<string, string>;
  onLoad?: () => void;
  onError?: () => void;
}

export interface OptimizedImage {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

export interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

// ============================================================================
// DEFAULT CONFIG
// ============================================================================

const defaultConfig: ImageConfig = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['webp', 'jpeg'],
  quality: 75,
  basePath: '/_float/image',
  domains: [],
  minimumCacheTTL: 60,
  disableStaticImages: false,
  avif: false,
};

let imageConfig: ImageConfig = { ...defaultConfig };

export function configureImages(config: Partial<ImageConfig>): void {
  imageConfig = { ...defaultConfig, ...config };
}

export function getImageConfig(): ImageConfig {
  return imageConfig;
}

// ============================================================================
// IMAGE LOADER (for client-side)
// ============================================================================

/**
 * Default image loader
 */
export function floatImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const q = quality || imageConfig.quality;
  return `${imageConfig.basePath}?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(src: string, sizes: number[]): string {
  return sizes
    .map(size => `${floatImageLoader({ src, width: size })} ${size}w`)
    .join(', ');
}

/**
 * Generate responsive image props
 */
export function getImageProps(props: ImageProps): {
  src: string;
  srcSet: string;
  sizes: string;
  width?: number;
  height?: number;
  loading: 'lazy' | 'eager';
  decoding: 'async' | 'sync';
  style?: Record<string, string>;
} {
  const {
    src,
    width,
    height,
    fill,
    sizes = '100vw',
    quality,
    priority,
    loading = priority ? 'eager' : 'lazy',
    style,
  } = props;

  const allSizes = [...imageConfig.imageSizes, ...imageConfig.deviceSizes].sort((a, b) => a - b);

  // Filter sizes based on image width
  const relevantSizes = width
    ? allSizes.filter(s => s <= width * 2)
    : allSizes;

  return {
    src: floatImageLoader({ src, width: width || relevantSizes[relevantSizes.length - 1], quality }),
    srcSet: generateSrcSet(src, relevantSizes),
    sizes,
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    loading,
    decoding: 'async',
    style: fill ? {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    } : style,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const image = {
  configure: configureImages,
  getConfig: getImageConfig,
  loader: floatImageLoader,
  srcSet: generateSrcSet,
  props: getImageProps,
};

