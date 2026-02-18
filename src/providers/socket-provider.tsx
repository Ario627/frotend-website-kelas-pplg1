'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth-store';
import type { ReactionUpdatePayload, ViewUpdatePayload, AnnouncementWithStats } from '@/types/announcements.types';

interface ServerToClientEvents {
  'announcement:new': (data: AnnouncementWithStats) => void;
  'announcement:update': (data: AnnouncementWithStats) => void;
  'announcement:delete': (data: { id: string }) => void;
  'announcement:reaction': (data: ReactionUpdatePayload) => void;
  'announcement:view': (data: ViewUpdatePayload) => void;
  'announcement:pin': (data: { id: string; isPinned: boolean }) => void;
  error: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  'announcement:addReaction': (data: { announcementId: string; reactionType: string }) => void;
  'announcement:removeReaction': (data: { announcementId: string }) => void;
  'announcement:view': (data: { announcementId: string }) => void;
  'announcement:join': (data: { announcementId: string }) => void;
  'announcement:leave': (data: { announcementId: string }) => void;
}

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: TypedSocket | null;
  isConnected: boolean;
  joinRoom: (announcementId: string) => void;
  leaveRoom: (announcementId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinRoom: () => { },
  leaveRoom: () => { },
});

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<TypedSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const socketInstance = io(`${SOCKET_URL}/announcements`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      auth: user ? {
        token: undefined
      } : undefined,
    }) as TypedSocket;

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected to /announcements namespace');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    socketInstance.on('error', (data) => {
      console.error('[Socket] Error:', data.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  const joinRoom = useCallback((announcementId: string) => {
    socket?.emit('announcement:join', { announcementId });
  }, [socket]);

  const leaveRoom = useCallback((announcementId: string) => {
    socket?.emit('announcement:leave', { announcementId });
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
