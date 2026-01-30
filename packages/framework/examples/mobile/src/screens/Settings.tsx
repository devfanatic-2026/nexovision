import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useConnectionStore, connectionActions } from '../store/connection';
import { navigationActions } from '../store/navigation';
import { wsManager } from '../services/ws';

export default function Settings() {
    const { goHome } = navigationActions;
    const { isOnline, socketStatus } = useConnectionStore();

    const toggleConnection = () => {
        if (isOnline || socketStatus === 'connected') {
            wsManager.disconnect();
            // Force offline state in store too
            connectionActions.setOnline(false);
        } else {
            wsManager.connect();
        }
    };

    return (
        <View className="flex-1 bg-white p-4">
            <View className="flex-row items-center mb-8">
                <TouchableOpacity onPress={goHome}>
                    <Text className="text-blue-500 font-medium">Back</Text>
                </TouchableOpacity>
                <Text className="font-bold text-lg ml-4">Settings</Text>
            </View>

            <View className="bg-gray-50 p-4 rounded-lg flex-row justify-between items-center mb-4">
                <View>
                    <Text className="font-bold text-gray-800">Connection Status</Text>
                    <Text className="text-gray-500 text-xs">
                        {isOnline ? 'Online (WS Connected)' : 'Offline (Local Mode)'}
                    </Text>
                </View>
                <Switch
                    value={isOnline}
                    onValueChange={toggleConnection}
                />
            </View>

            <View className="p-4 bg-blue-50 rounded-lg">
                <Text className="text-blue-800 text-xs">
                    Toggling connection simulates losing network access.
                    When offline, the app uses the local mock database.
                    When online, it syncs with the server.
                </Text>
            </View>
        </View>
    );
}
