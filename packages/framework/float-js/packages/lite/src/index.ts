/**
 * Float.js Lite - Ultra Modern Client Framework
 * 
 * @packageDocumentation
 */

// Core exports
export { VERSION } from './version.js';

// Router
export {
  matchRoute,
  type Route as FloatRoute,
  type RouterOptions as FloatRouterOptions,
} from './router/index.js';

// Types for user applications
export interface FloatConfig {
  /** App directory (default: 'app') */
  appDir?: string;
  /** Base path for all routes */
  basePath?: string;
  /** Enable React strict mode */
  reactStrictMode?: boolean;
  /** Internationalization config */
  i18n?: {
    locales: string[];
    defaultLocale: string;
  };
  /** Environment variables to expose to client */
  env?: Record<string, string>;
}

// Re-export React types for convenience
export type {
  ReactNode,
  ReactElement,
  FC,
  ComponentType
} from 'react';

// Float.js Hooks - Modern utilities for applications
export {
  useFloatRouter,
  useFloatData,
  useFloatForm,
  useFloatAsync,
  useFloatDebounce,
  useFloatThrottle,
  createFloatStore,
  useFloatStore,
  combineFloatStores,
  floatMiddleware,
  validators,
} from './hooks/index.js';

// AI Module - Native AI integration
export {
  ai,
  streamResponse,
  sseResponse,
  aiAction,
  OpenAIProvider,
  AnthropicProvider,
  type AIProvider,
  type ChatOptions,
  type Message,
  type AIResponse,
} from './ai/index.js';

// Type-Safe API Module
export {
  f,
  typedRoute,
  json,
  error,
  redirect,
  FloatValidationError,
  type Infer,
} from './api/index.js';

// Real-time Module - Built-in WebSocket support
export {
  realtime,
  createRealtimeClient,
  type RealtimeClient,
  type RealtimeMessage,
  type RealtimeRoom,
  type PresenceState,
  type RealtimeOptions,
} from './network/index.js';

// Image Optimization (Loaders)
export {
  image,
  configureImages,
  getImageConfig,
  floatImageLoader,
  generateSrcSet,
  getImageProps,
  type ImageConfig,
  type ImageProps,
  type OptimizedImage,
} from './image/index.js';

// Edge Middleware (Client utils)
export {
  middleware,
  NextResponse,
  createNextUrl,
  type MiddlewareRequest,
  type MiddlewareHandler,
  type MiddlewareConfig,
  type NextURL,
  type GeoData,
} from './middleware/index.js';
// React Native Safe Exports - Named exports for better tree-shaking
export {
  // Core Components
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  SectionList,
  VirtualizedList,
  SafeAreaView,

  // Input Components
  TextInput,
  Button,
  Switch,
  Slider,

  // Touchables
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Touchable,

  // UI Components
  ActivityIndicator,
  Modal,
  RefreshControl,
  StatusBar,
  KeyboardAvoidingView,

  // APIs
  StyleSheet,
  Platform,
  Dimensions,
  PixelRatio,
  Animated,
  Easing,
  Keyboard,
  LayoutAnimation,
  PanResponder,

  // Utilities
  Alert,
  Linking,
  Share,
  Vibration,
  AppState,
  BackHandler,

  // Types
  type ViewStyle,
  type TextStyle,
  type ImageStyle,
  type StyleProp,
  type ViewProps,
  type TextProps,
  type ImageProps as RNImageProps,
  type ScrollViewProps,
  type FlatListProps,
  type TouchableOpacityProps,
} from './react-native.js';

