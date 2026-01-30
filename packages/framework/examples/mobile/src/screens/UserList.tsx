import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import { User } from '../services/local-db';
import { navigationActions } from '../store/navigation';
import { useConnectionStore } from '../store/connection';
import { useState, useEffect } from 'react';

export default function UserList() {
    const { navigate, goHome } = navigationActions;
    const { isOnline } = useConnectionStore(); // Just to trigger re-render on connection change
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await api.users.getAll();
            // Merge with local pending if needed (api logic handles selection)
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [isOnline]); // Reload when connectivity changes

    const renderItem = ({ item }: { item: User }) => (
        <TouchableOpacity
            className={`p-4 border-b border-gray-200 ${item.id < 0 ? 'bg-yellow-50' : 'bg-white'}`}
            onPress={() => navigate('UserForm', { id: item.id })}
        >
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="font-bold text-lg">{item.id < 0 ? `* ${item.name}` : item.name}</Text>
                    <Text className="text-gray-500">{item.email}</Text>
                    <Text className="text-xs text-gray-400 uppercase">{item.role}</Text>
                </View>
                <View className="items-end">
                    <View className={`w-3 h-3 rounded-full ${item.status === 'online' ? 'bg-green-500' :
                            item.status === 'away' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`} />
                    {item.id < 0 && <Text className="text-xs text-yellow-600 font-bold mt-1">Pending Sync</Text>}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-white shadow-sm">
                <TouchableOpacity onPress={goHome}>
                    <Text className="text-blue-500 font-medium">Back</Text>
                </TouchableOpacity>
                <Text className="font-bold text-lg text-gray-800">Users</Text>
                <TouchableOpacity
                    className="bg-blue-500 px-3 py-1 rounded"
                    onPress={() => navigate('UserForm', {})}
                >
                    <Text className="text-white font-bold">+ New</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    refreshing={loading}
                    onRefresh={loadData}
                />
            )}
        </View>
    );
}
