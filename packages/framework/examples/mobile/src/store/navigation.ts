import { createFloatStore } from '@float.js/lite';

export type ScreenName =
    | 'Home'
    | 'Users'
    | 'UserForm'
    | 'Products'
    | 'Chat'
    | 'AIChat'
    | 'Settings';

interface NavigationState {
    currentScreen: ScreenName;
    params: Record<string, any>;
}

export const useNavigationStore = createFloatStore<NavigationState>({
    currentScreen: 'Home',
    params: {},
}, { persist: false });

export const navigationActions = {
    navigate: (screen: ScreenName, params: Record<string, any> = {}) =>
        useNavigationStore.setState({ currentScreen: screen, params }),
    goHome: () => useNavigationStore.setState({ currentScreen: 'Home', params: {} }),
    goBack: () => useNavigationStore.setState({ currentScreen: 'Home', params: {} }), // Simple back to home
};
