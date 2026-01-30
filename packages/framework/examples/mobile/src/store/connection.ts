import { createFloatStore } from '@float.js/lite';

export interface ConnectionState {
    isOnline: boolean;
    isSyncing: boolean;
    lastSync: string | null;
    socketStatus: 'connected' | 'disconnected' | 'connecting';
}

export const useConnectionStore = createFloatStore<ConnectionState>({
    isOnline: false, // Default to offline until connected
    isSyncing: false,
    lastSync: null,
    socketStatus: 'disconnected',
}, {
    persist: false // Session based
});

export const connectionActions = {
    setOnline: (status: boolean) => useConnectionStore.setState({ isOnline: status }),
    setSyncing: (status: boolean) => useConnectionStore.setState({ isSyncing: status }),
    setLastSync: (time: string) => useConnectionStore.setState({ lastSync: time }),
    setSocketStatus: (status: 'connected' | 'disconnected' | 'connecting') =>
        useConnectionStore.setState({ socketStatus: status, isOnline: status === 'connected' }),
};
