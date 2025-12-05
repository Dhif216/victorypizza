import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://victorypizza-production-9dbc.up.railway.app';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join the restaurant dashboard room to receive all order updates
  joinDashboard() {
    if (this.socket) {
      this.socket.emit('join-dashboard');
      console.log('📡 Joined dashboard room');
    }
  }

  // Track a specific order
  trackOrder(orderId: string) {
    if (this.socket) {
      this.socket.emit('track-order', orderId);
      console.log(`📍 Tracking order: ${orderId}`);
    }
  }

  // Listen for new orders (for dashboard)
  onNewOrder(callback: (order: any) => void) {
    if (this.socket) {
      this.socket.on('new-order', callback);
    }
  }

  // Listen for order updates (for dashboard and tracking)
  onOrderUpdated(callback: (order: any) => void) {
    if (this.socket) {
      this.socket.on('order-updated', callback);
    }
  }

  // Remove listeners
  offNewOrder(callback?: (order: any) => void) {
    if (this.socket) {
      this.socket.off('new-order', callback);
    }
  }

  offOrderUpdated(callback?: (order: any) => void) {
    if (this.socket) {
      this.socket.off('order-updated', callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
