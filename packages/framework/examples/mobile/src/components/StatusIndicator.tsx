import { View, Text } from 'react-native';
import { useConnectionStore } from '../store/connection';

export function StatusIndicator() {
    const { isOnline, socketStatus, isSyncing } = useConnectionStore();

    let statusColor = 'bg-red-500';
    let statusText = 'Offline';

    if (socketStatus === 'connecting') {
        statusColor = 'bg-yellow-500';
        statusText = 'Connecting...';
    } else if (isOnline) {
        statusColor = 'bg-green-500';
        statusText = 'Online';
    }

    return (
        <View className="flex-row items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
            <View className={`w-3 h-3 rounded-full mr-2 ${statusColor}`} />
            <Text className="text-xs font-semibold text-gray-700 uppercase">
                {statusText} {isSyncing ? '(Syncing...)' : ''}
            </Text>
            <View className="flex-1" />
            <Text className="text-xs text-gray-500">
                WS: {socketStatus}
            </Text>
        </View>
    );
}
