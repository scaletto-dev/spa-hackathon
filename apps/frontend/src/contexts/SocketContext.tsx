import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect to backend WebSocket (same server as API)
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
}
