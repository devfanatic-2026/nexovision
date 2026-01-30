import { useConnectionStore } from '../store/connection';
import { chatActions } from '../store/chat';

const WS_URL = process.env.FLOAT_WS_URL || 'ws://localhost:4000';

class WSManager {
    socket: WebSocket | null = null;
    reconnectInterval: any = null;

    connect() {
        if (this.socket) return;
        try {
            this.socket = new WebSocket(WS_URL);

            this.socket.onopen = () => {
                console.log('WS Connected');
                useConnectionStore.setState({ socketStatus: 'connected', isOnline: true });
                if (this.reconnectInterval) {
                    clearInterval(this.reconnectInterval);
                    this.reconnectInterval = null;
                }

                // Join 'global' room by default
                this.send({ type: 'join', roomId: 'global', userId: Date.now() }); // Random user
            };

            this.socket.onclose = () => {
                console.log('WS Disconnected');
                useConnectionStore.setState({ socketStatus: 'disconnected', isOnline: false });
                this.socket = null;
                this.scheduleReconnect();
            };

            this.socket.onerror = (e) => {
                console.error('WS Error:', e);
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'history') {
                        chatActions.setMessages(data.messages);
                    } else if (data.type === 'new_message') {
                        chatActions.addMessage(data.message);
                    }
                } catch (e) {
                    console.error('WS Message parsing error:', e);
                }
            };

            useConnectionStore.setState({ socketStatus: 'connecting' });
        } catch (e) {
            console.error('WS Connection failed:', e);
            this.scheduleReconnect();
        }
    }

    scheduleReconnect() {
        if (this.reconnectInterval) return;
        this.reconnectInterval = setInterval(() => {
            console.log('Attempting WS Reconnect...');
            this.connect();
        }, 5000); // Retry every 5s
    }

    disconnect() {
        if (this.reconnectInterval) clearInterval(this.reconnectInterval);
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        useConnectionStore.setState({ socketStatus: 'disconnected', isOnline: false });
    }

    send(data: any) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn('Cannot send message: WS not connected');
        }
    }
}

export const wsManager = new WSManager();
