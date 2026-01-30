import { createFloatStore } from '@float.js/lite';

export interface ChatMessage {
    id: number;
    roomId: string; // 'global' for this demo
    userId: number;
    message: string;
    timestamp: string;
}

interface ChatState {
    messages: ChatMessage[];
    roomId: string;
}

export const useChatStore = createFloatStore<ChatState>({
    messages: [],
    roomId: 'global',
}, { persist: false });

export const chatActions = {
    addMessage: (msg: ChatMessage) => useChatStore.setState(state => ({
        messages: [...state.messages, msg]
    })),
    setMessages: (msgs: ChatMessage[]) => useChatStore.setState({ messages: msgs }),
    joinRoom: (roomId: string) => useChatStore.setState({ roomId }),
    clear: () => useChatStore.setState({ messages: [] }),
};
