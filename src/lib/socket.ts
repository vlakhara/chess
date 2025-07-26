let socket: WebSocket | null = null;
let reconnectInterval: NodeJS.Timeout | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 30000; // 30 seconds

export interface SocketMessage {
  type: string;
  payload?: Record<string, unknown>;
}

export const isSocketConnected = (): boolean => {
  return socket !== null && socket.readyState === WebSocket.OPEN;
};

export const getSocket = (): WebSocket | null => {
  return socket;
};

export const initializeSocket = (): WebSocket | null => {
  try {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:8000/chess";
    
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      socket = new WebSocket(socketUrl);
      
      socket.onopen = () => {
        console.log("Socket connected successfully");
        reconnectAttempts = 0;
        if (reconnectInterval) {
          clearInterval(reconnectInterval);
          reconnectInterval = null;
        }
      };

      socket.onclose = () => {
        console.log("Socket disconnected");
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          scheduleReconnect();
        }
      };

      socket.onerror = (error) => {
        console.error("Socket error:", error);
      };
    }
    return socket;
  } catch (error) {
    console.error("Error initializing socket:", error);
    return null;
  }
};

const scheduleReconnect = () => {
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
  }
  
  reconnectAttempts++;
  console.log(`Attempting to reconnect... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
  
  reconnectInterval = setTimeout(() => {
    if (socket && socket.readyState !== WebSocket.OPEN) {
      socket.close();
      socket = null;
      initializeSocket();
    }
  }, RECONNECT_DELAY);
};

export const stopReconnection = () => {
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
    reconnectInterval = null;
  }
  reconnectAttempts = 0;
};

export const getReconnectAttempts = (): number => {
  return reconnectAttempts;
};

export const getMaxReconnectAttempts = (): number => {
  return MAX_RECONNECT_ATTEMPTS;
};

export const joinGame = (gameId: string, username: string) => {
  const socket = initializeSocket();
  if (!socket) {
    return;
  }
  const sendJoin = () => {
    socket.send(
      JSON.stringify({
        type: "JOIN",
        payload: {
          gameId,
          username,
        },
      })
    );
  };

  if (socket?.readyState === WebSocket.OPEN) {
    sendJoin();
  } else {
    socket.onopen = sendJoin;
  }
};

export const sendMessage = (
  type: string,
  payload?: Record<string, unknown>
) => {
  const socket = initializeSocket();
  if (!socket) {
    return;
  }
  socket.send(JSON.stringify({ type, payload }));
};

export const onMessage = (callback: (data: SocketMessage) => void) => {
  const socket = initializeSocket();
  if (!socket) {
    return;
  }
  socket.onmessage = (event) => {
    callback(JSON.parse(event.data));
  };
};

export const onClose = (callback: () => void) => {
  const socket = initializeSocket();
  if (!socket) {
    return;
  }
  socket.onclose = callback;
};

export const onError = (callback: (error: Event) => void) => {
  const socket = initializeSocket();
  if (!socket) {
    return;
  }
  socket.onerror = callback;
};
