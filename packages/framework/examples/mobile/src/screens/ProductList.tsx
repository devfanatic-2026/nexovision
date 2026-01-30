import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { api } from '../services/api';
import { Product } from '../services/local-db';
import { navigationActions } from '../store/navigation';
import { useConnectionStore } from '../store/connection';
import { useState, useEffect } from 'react';

export default function ProductList() {
    const { goHome } = navigationActions;
    const { isOnline } = useConnectionStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await api.products.getAll();
            setProducts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [isOnline]);

    const renderItem = ({ item }: { item: Product }) => (
        <View className="mb-4 bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex-row">
            <Image
                source={{ uri: item.image }}
                className="w-20 h-20 rounded bg-gray-200"
                resizeMode="cover"
            />
            <View className="flex-1 ml-3 justify-center">
                <Text className="font-bold text-gray-800">{item.name}</Text>
                <Text className="text-blue-500 font-bold mt-1">${item.price}</Text>
                <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <View className="flex-row items-center p-4 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={goHome}>
                    <Text className="text-blue-500 font-medium">Back</Text>
                </TouchableOpacity>
                <Text className="font-bold text-lg ml-4">Products</Text>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    className="p-4"
                />
            )}
        </View>
    );
}
