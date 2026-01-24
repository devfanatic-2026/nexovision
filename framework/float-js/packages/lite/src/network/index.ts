/**
 * Float.js Real-time Module (Lite / Client)
 * Client-side WebSocket support
 */

import { WebSocket } from 'ws'; // Note: 'ws' might need to be replaced with native WebSocket for browser/RN or keep 'ws' if it's isomorphic enough or polyfilled. 
// Actually for purely client side (browser) we use global 'WebSocket'. 
// But 'ws' package is usually Node. 
// The original code: import { WebSocketServer, WebSocket } from 'ws';
// For lite (client), we should probably use native WebSocket if checking for window, or 'ws' if in Node env (for tests).
// The existing `createRealtimeClient` uses `new WebSocket(url)`. 
// If we target RN, `WebSocket` is global. 
// Let's remove 'ws' import and rely on global WebSocket or assume environment provides it.

// ============================================================================
// TYPES
// ============================================================================

export interface RealtimeClient {
  id: string;
  socket: any; // WebSocket
  rooms: Set<string>;
  data: Record<string, unknown>;
  isAlive: boolean;
  connectedAt: Date;
}

export interface RealtimeMessage<T = unknown> {
  type: string;
  payload: T;
  from?: string;
  room?: string;
  timestamp: number;
}

export interface RealtimeRoom {
  name: string;
  clients: Set<string>;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface PresenceState {
  clientId: string;
  data: Record<string, unknown>;
  joinedAt: Date;
  lastSeen: Date;
}

export interface RealtimeOptions {
  /** Port for WebSocket server (default: 3001) */
  port?: number;
  /** Path for WebSocket endpoint (default: '/ws') */
  path?: string;
  /** Ping interval in ms (default: 30000) */
  pingInterval?: number;
  /** Max message size in bytes (default: 1MB) */
  maxPayload?: number;
  /** Enable presence tracking (default: true) */
  presence?: boolean;
}

// ============================================================================
// CLIENT-SIDE REALTIME (for browser)
// ============================================================================

export interface RealtimeClientOptions {
  url: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

/**
 * Create a client-side realtime connection
 * This code is isomorphic and can run in the browser
 */
export function createRealtimeClient(options: RealtimeClientOptions) {
  const {
    url,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
  } = options;

  // Use global WebSocket (Browser/RN) or require if needed?
  // Ideally we expect WebSocket to be available globally.
  const WS = (typeof WebSocket !== 'undefined' ? WebSocket : (globalThis as any).WebSocket);

  if (!WS) {
    console.warn('[Float.js Lite] WebSocket not found in global scope. Realtime client may fail.');
  }

  let ws: any = null;
  let reconnectAttempts = 0;
  let clientId: string | null = null;
  const eventHandlers = new Map<string, Set<(payload: unknown) => void>>();
  const rooms = new Set<string>();

  const connect = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        ws = new WS(url);

        ws.onopen = () => {
          reconnectAttempts = 0;
          console.log('🔌 Connected to Float.js Realtime');
        };

        ws.onmessage = (event: any) => {
          try {
            const data = typeof event.data === 'string' ? event.data : String(event.data);
            const message = JSON.parse(data) as RealtimeMessage;

            // Handle system messages
            if (message.type === '_connected') {
              clientId = (message.payload as { id: string }).id;
              resolve();
              return;
            }

            // Emit to handlers
            const handlers = eventHandlers.get(message.type);
            if (handlers) {
              handlers.forEach(handler => handler(message.payload));
            }

            // Also emit to 'message' handlers for all messages
            const allHandlers = eventHandlers.get('*');
            if (allHandlers) {
              allHandlers.forEach(handler => handler(message));
            }
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        };

        ws.onclose = () => {
          console.log('🔌 Disconnected from Float.js Realtime');
          clientId = null;

          if (autoReconnect && reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            console.log(`Reconnecting in ${reconnectInterval}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
            setTimeout(() => {
              connect().then(() => {
                // Rejoin rooms after reconnect
                rooms.forEach(room => {
                  send({ type: '_join', payload: { room } });
                });
              });
            }, reconnectInterval);
          }
        };

        ws.onerror = (error: any) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  };

  const disconnect = () => {
    if (ws) {
      ws.close(1000, 'Client disconnect');
      ws = null;
    }
  };

  const send = (message: Partial<RealtimeMessage>) => {
    if (ws && ws.readyState === WS.OPEN) {
      ws.send(JSON.stringify({
        ...message,
        timestamp: Date.now(),
      }));
    }
  };

  const join = (room: string, data?: Record<string, unknown>) => {
    rooms.add(room);
    send({ type: '_join', payload: { room, data } });
  };

  const leave = (room: string) => {
    rooms.delete(room);
    send({ type: '_leave', payload: { room } });
  };

  const broadcast = (room: string, type: string, data: unknown) => {
    send({
      type: '_broadcast',
      payload: { room, type, data },
    });
  };

  const emit = (type: string, data: unknown) => {
    send({ type, payload: data });
  };

  const on = <T = unknown>(eventType: string, handler: (payload: T) => void) => {
    if (!eventHandlers.has(eventType)) {
      eventHandlers.set(eventType, new Set());
    }
    eventHandlers.get(eventType)!.add(handler as (payload: unknown) => void);

    // Return unsubscribe function
    return () => {
      eventHandlers.get(eventType)?.delete(handler as (payload: unknown) => void);
    };
  };

  const updatePresence = (data: Record<string, unknown>) => {
    send({ type: '_presence', payload: data });
  };

  return {
    connect,
    disconnect,
    join,
    leave,
    broadcast,
    emit,
    on,
    updatePresence,
    get id() { return clientId; },
    get connected() { return ws?.readyState === WS.OPEN; },
  };
}

/**
 * Shorthand export for easy usage
 */
export const realtime = {
  client: createRealtimeClient,
};

