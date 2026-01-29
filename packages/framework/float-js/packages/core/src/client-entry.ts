/**
 * Float.js Client-Side Entry Point
 * Exports only browser-safe modules
 */

export {
    VERSION
} from './version.js';

// Hooks - 100% Client Safe
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
    type FloatRouter,
    type FloatRouterState,
    type NavigateOptions,
    type FloatDataOptions,
    type FloatDataResult,
    type FloatFormOptions,
    type FloatFormResult,
    type FieldState,
    type ValidationRule,
    type AsyncState,
    type FloatAsyncResult,
    type FloatAsyncOptions,
    type FloatStore,
    type FloatStoreOptions
} from './hooks/index.js';

// Re-export React types for convenience
export type {
    ReactNode,
    ReactElement,
    FC,
    ComponentType
} from 'react';

// Client Utilities
export {
    generateWelcomePage
} from './client/welcome-page.js';
