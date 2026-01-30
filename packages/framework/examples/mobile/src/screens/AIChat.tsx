import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import { navigationActions } from '../store/navigation';
import { useState } from 'react';

interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

export default function AIChat() {
    const { goHome } = navigationActions;
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', text: 'Hello! I am the Float.js AI Assistant. Ask me anything about the framework.', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.ai.chat(userMsg.text);
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: response.reply,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Sorry, I encounted an error.', sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: ChatMessage }) => (
        <View className={`mb-4 max-w-[80%] p-3 rounded-lg ${item.sender === 'user'
                ? 'self-end bg-blue-500 rounded-br-none'
                : 'self-start bg-gray-200 rounded-bl-none'
            }`}>
            <Text className={item.sender === 'user' ? 'text-white' : 'text-gray-800'}>
                {item.text}
            </Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center p-4 border-b border-gray-200 shadow-sm">
                <TouchableOpacity onPress={goHome}>
                    <Text className="text-blue-500 font-medium">Back</Text>
                </TouchableOpacity>
                <Text className="font-bold text-lg ml-4">AI Assistant (RAG)</Text>
            </View>

            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                className="flex-1"
            />

            <View className="p-4 border-t border-gray-200 flex-row items-center">
                <TextInput
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 bg-gray-50"
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message..."
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                    editable={!loading}
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    disabled={loading || !input.trim()}
                    className={`p-2 rounded-full ${loading || !input.trim() ? 'bg-gray-300' : 'bg-blue-500'}`}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text className="text-white font-bold px-2">→</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
