import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { navigationActions } from '../store/navigation';

export default function Home() {
    const { navigate } = navigationActions;

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <Text className="text-2xl font-bold mb-4">Float.js Mobile Showcase</Text>

            <View className="grid grid-cols-2 gap-4">
                <TouchableOpacity
                    className="bg-blue-500 p-4 rounded-lg mb-2"
                    onPress={() => navigate('Users')}
                >
                    <Text className="text-white font-bold text-center">Users (CRUD)</Text>
                    <Text className="text-white text-xs text-center mt-1">Manage users with offline sync</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-indigo-500 p-4 rounded-lg mb-2"
                    onPress={() => navigate('Products')}
                >
                    <Text className="text-white font-bold text-center">Products</Text>
                    <Text className="text-white text-xs text-center mt-1">Product list and search</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-green-500 p-4 rounded-lg mb-2"
                    onPress={() => navigate('Chat')}
                >
                    <Text className="text-white font-bold text-center">Real-Time Chat</Text>
                    <Text className="text-white text-xs text-center mt-1">WebSocket demo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-purple-500 p-4 rounded-lg mb-2"
                    onPress={() => navigate('AIChat')}
                >
                    <Text className="text-white font-bold text-center">AI Assistant</Text>
                    <Text className="text-white text-xs text-center mt-1">RAG via server endpoint</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-gray-500 p-4 rounded-lg mb-2"
                    onPress={() => navigate('Settings')}
                >
                    <Text className="text-white font-bold text-center">Connection Test</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
