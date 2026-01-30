import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { wsManager } from '../services/ws';
import { useChatStore } from '../store/chat';
import { navigationActions } from '../store/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Chat() {
    const { goHome } = navigationActions;
    const { messages, roomId } = useChatStore();
    const [input, setInput] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = () => {
        if (!input.trim()) return;

        wsManager.send({
            type: 'message',
            text: input,
            roomId,
            userId: Date.now() // Simple unique ID
        });

        setInput('');
    };

    const renderItem = ({ item }: { item: any }) => (
        <View className="mb-2 p-2 bg-gray-100 rounded-lg max-w-[80%] self-start">
            <Text className="text-gray-800">{item.message}</Text>
            <Text className="text-xs text-gray-400 mt-1">
                {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center p-4 border-b border-gray-200">
                <TouchableOpacity onPress={goHome}>
                    <Text className="text-blue-500 font-medium">Back</Text>
                </TouchableOpacity>
                <Text className="font-bold text-lg ml-4">Real-Time Chat</Text>
                <View className="flex-1 items-end">
                    <View className="bg-green-100 px-2 py-1 rounded">
                        <Text className="text-xs text-green-700">Room: {roomId}</Text>
                    </View>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 16 }}
                className="flex-1"
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View className="p-4 border-t border-gray-200 flex-row items-center">
                <TextInput
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 bg-gray-50"
                    value={input}
                    onChangeText={setInput}
                    placeholder="Message..."
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    disabled={!input.trim()}
                    className={`p-2 rounded-full ${!input.trim() ? 'bg-gray-300' : 'bg-green-500'}`}
                >
                    <Text className="text-white font-bold px-2">Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
