// Real-time updates
export class WebSocketService {
    private ws: WebSocket | null = null;
    private listeners: Map<string, Function[]> = new Map();

    connect(url: string) {
        this.ws = new WebSocket(url);

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const listeners = this.listeners.get(data.type) || [];
            listeners.forEach(listener => listener(data));
        };
    }

    subscribe(eventType: string, callback: Function) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType)!.push(callback);
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export const websocketService = new WebSocketService();