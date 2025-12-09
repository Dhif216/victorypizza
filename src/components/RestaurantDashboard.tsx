import { useState, useEffect } from 'react';
import { Package, Clock, User, Phone, MapPin, Mail, CreditCard, Banknote, X, RefreshCw, Filter, Lock, Settings, Trash2, Star } from 'lucide-react';
import { orderAPI, authAPI } from '../services/api';
import { socketService } from '../services/socket';
import { UserSettings } from './UserSettings';
import { ToastContainer } from './Toast';

interface DashboardProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  onClose?: () => void;
}

interface OrderItem {
  name: string;
  quantity: number;
  size?: string;
  notes?: string;
  price: number;
}

interface Order {
  orderId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  orderTime: string;
  estimatedTime: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    total: number;
  };
  deliveryMethod: 'delivery' | 'pickup';
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    notes?: string;
  };
  payment: {
    method: 'card' | 'cash';
    status: string;
  };
  review?: {
    rating: number;
    comment?: string;
    createdAt?: string;
  };
  rejectionReason?: string;
  rejectedAt?: string;
  timestamp?: number;
}

export function RestaurantDashboard({ language, theme, onClose }: DashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [deletingCompleted, setDeletingCompleted] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>>([]);
  
  // Reject order state
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingOrder, setRejectingOrder] = useState(false);
  
  // Login state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Toast notification helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Load orders function
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderAPI.getAllOrders();
      console.log('✅ Loaded orders from API:', response.orders);
      
      // Sort orders by timestamp (newest first)
      const sortedOrders = response.orders.sort((a: Order, b: Order) => 
        new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
      );
      
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Error loading orders:', error);
      setError(error.message || 'Failed to load orders');
      setLoading(false);
    }
  };

  // Initialize Socket.IO and load orders (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

    // Connect to Socket.IO
    socketService.connect();
    socketService.joinDashboard();

    // Load initial orders
    loadOrders();

    // Listen for new orders
    const handleNewOrder = (order: Order) => {
      console.log('🔔 New order received:', order);
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => console.log('Could not play sound'));
      
      // Add to orders list
      setOrders(prev => [order, ...prev]);
      
      // Show toast notification
      addToast(
        language === 'fi' 
          ? `Uusi tilaus! ${order.orderId} - €${order.pricing?.total?.toFixed(2) || '0.00'}`
          : `New Order! ${order.orderId} - €${order.pricing?.total?.toFixed(2) || '0.00'}`,
        'success'
      );
      
      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Order!', {
          body: `Order ${order.orderId} - €${order.pricing?.total?.toFixed(2) || '0.00'}`,
          icon: '/pizza-icon.png'
        });
      }
    };

    // Listen for order updates
    const handleOrderUpdated = (updatedOrder: Order) => {
      console.log('🔄 Order updated:', updatedOrder);
      setOrders(prev => prev.map(order => 
        order.orderId === updatedOrder.orderId ? updatedOrder : order
      ));
      
      // Update selected order if it's the one being viewed
      if (selectedOrder?.orderId === updatedOrder.orderId) {
        setSelectedOrder(updatedOrder);
      }
    };

    socketService.onNewOrder(handleNewOrder);
    socketService.onOrderUpdated(handleOrderUpdated);

    // Auto-refresh fallback every 30 seconds
    const interval = autoRefresh ? setInterval(loadOrders, 30000) : null;

    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
      socketService.offNewOrder(handleNewOrder);
      socketService.offOrderUpdated(handleOrderUpdated);
      socketService.disconnect();
    };
  }, [isAuthenticated, autoRefresh, selectedOrder]);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      await authAPI.login(email, password);
      setIsAuthenticated(true);
      console.log('✅ Login successful');
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      setLoginError(error.response?.data?.message || (language === 'fi' ? 'Kirjautuminen epäonnistui' : 'Login failed'));
    }
  };

  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  // Handle delete completed orders
  const handleDeleteCompleted = async () => {
    console.log('🗑️ Delete button clicked');
    console.log('Current orders:', orders);
    console.log('Completed orders count:', orders.filter(o => o.status === 'completed').length);
    
    const confirmMessage = language === 'fi' 
      ? 'Haluatko varmasti poistaa kaikki valmiit tilaukset? Tätä ei voi perua.'
      : 'Are you sure you want to delete all completed orders? This cannot be undone.';
    
    if (!window.confirm(confirmMessage)) {
      console.log('❌ User cancelled delete');
      return;
    }

    console.log('✅ User confirmed delete, sending request...');
    setDeletingCompleted(true);
    try {
      const result = await orderAPI.deleteCompletedOrders();
      console.log('✅ Delete result:', result);
      
      addToast(
        language === 'fi'
          ? `Poistettu ${result.deletedCount || 0} tilausta`
          : `Deleted ${result.deletedCount || 0} orders`,
        'success'
      );
      
      console.log('🔄 Reloading orders...');
      await loadOrders(); // Refresh order list
    } catch (error: any) {
      console.error('❌ Delete completed orders error:', error);
      console.error('Error response:', error.response);
      addToast(
        language === 'fi'
          ? `Tilausten poisto epäonnistui: ${error.response?.data?.message || error.message}`
          : `Failed to delete orders: ${error.response?.data?.message || error.message}`,
        'error'
      );
    } finally {
      setDeletingCompleted(false);
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
      }`}>
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${
          theme === 'light' ? 'bg-white' : 'bg-gray-900 border border-gray-800'
        }`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {language === 'fi' ? 'Ravintolan hallinta' : 'Restaurant Dashboard'}
            </h2>
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {language === 'fi' ? 'Kirjaudu sisään jatkaaksesi' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className={`block text-sm font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {language === 'fi' ? 'Sähköposti' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  theme === 'light'
                    ? 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                    : 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                } outline-none transition-colors`}
                placeholder="admin@victorypizza.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {language === 'fi' ? 'Salasana' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  theme === 'light'
                    ? 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                    : 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                } outline-none transition-colors`}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {language === 'fi' ? 'Kirjaudu sisään' : 'Sign In'}
            </button>

            <div className={`text-center text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              <p>{language === 'fi' ? 'Oletus tunnukset:' : 'Default credentials:'}</p>
              <p className="font-mono mt-1">admin@victorypizza.com</p>
              <p className="font-mono">admin123</p>
              <p className="text-xs mt-2 text-green-600">{language === 'fi' ? '⚠️ Vaihda salasana tuotannossa!' : '⚠️ Change password in production!'}</p>
            </div>
          </form>

          {onClose && (
            <button
              onClick={onClose}
              className={`mt-6 w-full py-2 rounded-lg ${
                theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {language === 'fi' ? 'Takaisin' : 'Back'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);
      
      // Optimistic UI update - update immediately for instant feedback
      setOrders(prev => prev.map(order => 
        order.orderId === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      // Update selected order if it's the one being changed
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      
      // Send update to server
      await orderAPI.updateOrderStatus(orderId, newStatus);
      
      // Show success toast
      addToast(
        language === 'fi' 
          ? `Tilaus ${orderId} päivitetty: ${getStatusLabel(newStatus)}`
          : `Order ${orderId} updated: ${getStatusLabel(newStatus)}`,
        'success'
      );
      
      // The Socket.IO event will sync with other clients
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      // Revert on error
      await loadOrders();
      addToast(
        language === 'fi' 
          ? 'Tilauksen päivitys epäonnistui!' 
          : 'Failed to update order status!',
        'error'
      );
    }
  };

  // Reject order with reason
  const handleRejectOrder = async () => {
    if (!selectedOrder || !rejectionReason.trim()) {
      addToast(
        language === 'fi' 
          ? 'Syötä hylkäämisen syy' 
          : 'Please enter a rejection reason',
        'error'
      );
      return;
    }

    try {
      setRejectingOrder(true);
      console.log(`🚫 Rejecting order ${selectedOrder.orderId} with reason: ${rejectionReason}`);
      
      // Call API to cancel order with rejection reason
      await orderAPI.cancelOrder(selectedOrder.orderId, rejectionReason);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.orderId === selectedOrder.orderId 
          ? { ...order, status: 'cancelled' as any }
          : order
      ));
      
      setSelectedOrder(null);
      setShowRejectDialog(false);
      setRejectionReason('');
      
      addToast(
        language === 'fi' 
          ? `Tilaus ${selectedOrder.orderId} hylätty`
          : `Order ${selectedOrder.orderId} rejected`,
        'success'
      );
    } catch (error) {
      console.error('❌ Error rejecting order:', error);
      addToast(
        language === 'fi' 
          ? 'Tilauksen hylkääminen epäonnistui!' 
          : 'Failed to reject order!',
        'error'
      );
    } finally {
      setRejectingOrder(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'preparing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'delivering':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    const labels = {
      pending: { fi: 'Odottaa', en: 'Pending' },
      confirmed: { fi: 'Vahvistettu', en: 'Confirmed' },
      preparing: { fi: 'Valmistetaan', en: 'Preparing' },
      ready: { fi: 'Valmis', en: 'Ready' },
      delivering: { fi: 'Toimitetaan', en: 'Delivering' },
      completed: { fi: 'Valmis', en: 'Completed' },
      cancelled: { fi: 'Hylätty', en: 'Rejected' }
    };
    return language === 'fi' ? labels[status as keyof typeof labels]?.fi : labels[status as keyof typeof labels]?.en;
  };

  // Filter orders
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Get order counts
  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-black'}`}>
      {/* Header */}
      <div className={`border-b ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                🍕 {language === 'fi' ? 'Ravintolan hallinta' : 'Restaurant Dashboard'}
              </h1>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {language === 'fi' ? 'Hallinnoi tilauksia ja päivitä tilauksen tila' : 'Manage orders and update order status'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Auto-refresh toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  autoRefresh
                    ? 'bg-green-500 text-white'
                    : theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700 text-gray-300'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                {language === 'fi' ? 'Auto-päivitys' : 'Auto-refresh'}
              </button>

              {/* Manual refresh */}
              <button
                onClick={loadOrders}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Delete completed orders button */}
              <button
                onClick={handleDeleteCompleted}
                disabled={deletingCompleted}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  deletingCompleted
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
                style={{ 
                  color: theme === 'light' ? '#111827 !important' : '#ffffff !important', 
                  backgroundColor: deletingCompleted ? '#9ca3af' : '#f97316' 
                }}
                title={language === 'fi' ? 'Poista valmiit tilaukset' : 'Delete completed orders'}
              >
                <Trash2 className="w-4 h-4" style={{ color: theme === 'light' ? '#111827' : '#ffffff' }} />
                <span style={{ color: theme === 'light' ? '#111827 !important' : '#ffffff !important' }}>
                  {language === 'fi' ? 'Poista valmiit' : 'Delete Completed'}
                </span>
              </button>

              {/* Settings button */}
              <button
                onClick={() => setShowSettings(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === 'light' 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
                style={{ 
                  color: theme === 'light' ? '#111827 !important' : '#ffffff !important', 
                  backgroundColor: theme === 'light' ? '#f97316' : '#ea580c' 
                }}
                title={language === 'fi' ? 'Asetukset' : 'Settings'}
              >
                <Settings className="w-4 h-4" style={{ color: theme === 'light' ? '#111827' : '#ffffff' }} />
                <span style={{ color: theme === 'light' ? '#111827 !important' : '#ffffff !important' }}>
                  {language === 'fi' ? 'Asetukset' : 'Settings'}
                </span>
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-orange-500 hover:bg-orange-600 transition-all"
                style={{ 
                  color: theme === 'light' ? '#111827 !important' : '#ffffff !important', 
                  backgroundColor: '#f97316' 
                }}
              >
                <Lock className="w-4 h-4" style={{ color: theme === 'light' ? '#111827' : '#ffffff' }} />
                <span style={{ color: theme === 'light' ? '#111827 !important' : '#ffffff !important' }}>
                  {language === 'fi' ? 'Kirjaudu ulos' : 'Logout'}
                </span>
              </button>

              {/* Close button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-all ${
                    theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">{[
              { key: 'all', label: language === 'fi' ? 'Kaikki' : 'All', count: orderCounts.all },
              { key: 'pending', label: language === 'fi' ? 'Odottaa' : 'Pending', count: orderCounts.pending },
              { key: 'confirmed', label: language === 'fi' ? 'Vahvistettu' : 'Confirmed', count: orderCounts.confirmed },
              { key: 'preparing', label: language === 'fi' ? 'Valmistetaan' : 'Preparing', count: orderCounts.preparing },
              { key: 'ready', label: language === 'fi' ? 'Valmis' : 'Ready', count: orderCounts.ready },
              { key: 'delivering', label: language === 'fi' ? 'Toimitetaan' : 'Delivering', count: orderCounts.delivering },
              { key: 'completed', label: language === 'fi' ? 'Valmis' : 'Completed', count: orderCounts.completed },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  filterStatus === filter.key
                    ? 'bg-green-500 text-white shadow-lg'
                    : theme === 'light'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className={`w-12 h-12 mx-auto mb-4 animate-spin ${theme === 'light' ? 'text-green-500' : 'text-green-400'}`} />
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              {language === 'fi' ? 'Ladataan tilauksia...' : 'Loading orders...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl mb-6">
            <p className="font-bold mb-2">{language === 'fi' ? 'Virhe' : 'Error'}</p>
            <p>{error}</p>
            <button
              onClick={loadOrders}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
            >
              {language === 'fi' ? 'Yritä uudelleen' : 'Try Again'}
            </button>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders List */}
          <div className="space-y-4">
            <h2 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <Filter className="w-5 h-5 inline mr-2" />
              {language === 'fi' ? 'Tilaukset' : 'Orders'} ({filteredOrders.length})
            </h2>

            {filteredOrders.length === 0 ? (
              <div className={`p-8 rounded-xl border text-center ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'
              }`}>
                <Package className={`w-12 h-12 mx-auto mb-3 ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`} />
                <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {language === 'fi' ? 'Ei tilauksia' : 'No orders'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all transform hover:scale-[1.02] ${
                      selectedOrder?.orderId === order.orderId
                        ? 'border-green-500 shadow-lg'
                        : theme === 'light'
                        ? 'bg-white border-gray-200 hover:border-green-300'
                        : 'bg-gray-900 border-gray-800 hover:border-green-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            #{order.orderId}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.deliveryMethod === 'delivery'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {order.deliveryMethod === 'delivery' ? '🚚' : '🏪'}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {order.orderTime}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <User className="w-3 h-3 inline mr-1" />
                      {order.customer.name}
                    </div>

                    <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {order.items.length} {language === 'fi' ? 'tuotetta' : 'items'} • €{order.pricing?.total?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-100px)]">
            {selectedOrder ? (
              <div className={`p-6 rounded-xl border ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'
              }`}>
                <div className="flex items-start justify-between mb-6">
                  <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {language === 'fi' ? 'Tilauksen tiedot' : 'Order Details'}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                  {/* Order Status Controls */}
                  <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'}`}>
                    <label className={`block text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {language === 'fi' ? 'Päivitä tila' : 'Update Status'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['pending', 'confirmed', 'preparing', 'ready', selectedOrder.deliveryMethod === 'delivery' ? 'delivering' : null, 'completed']
                        .filter(Boolean)
                        .map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(selectedOrder.orderId, status as Order['status'])}
                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                              selectedOrder.status === status
                                ? 'bg-amber-500 text-white shadow-lg'
                                : theme === 'light'
                                ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                            }`}
                          >
                            {getStatusLabel(status as string)}
                          </button>
                        ))}
                    </div>
                    
                    {/* Reject Order Button */}
                    {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                      <button
                        onClick={() => setShowRejectDialog(true)}
                        className={`w-full mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                          theme === 'light' ? 'text-black' : 'text-white'
                        }`}
                        style={{ color: theme === 'light' ? '#111827' : '#ffffff' }}
                      >
                        <X className="w-4 h-4" style={{ color: theme === 'light' ? '#111827' : '#ffffff' }} />
                        {language === 'fi' ? 'Hylkää tilaus' : 'Reject Order'}
                      </button>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className={`text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {language === 'fi' ? 'Asiakas' : 'Customer'}
                    </h3>
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        <User className="w-4 h-4 text-amber-500" />
                        <span>{selectedOrder.customer.name}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        <Phone className="w-4 h-4 text-amber-500" />
                        <a href={`tel:${selectedOrder.customer.phone}`} className="hover:text-amber-500">
                          {selectedOrder.customer.phone}
                        </a>
                      </div>
                      {selectedOrder.customer.email && (
                        <div className={`flex items-center gap-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          <Mail className="w-4 h-4 text-amber-500" />
                          <a href={`mailto:${selectedOrder.customer.email}`} className="hover:text-amber-500">
                            {selectedOrder.customer.email}
                          </a>
                        </div>
                      )}
                      {selectedOrder.customer.address && (
                        <div className={`flex items-start gap-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          <MapPin className="w-4 h-4 text-amber-500 mt-1" />
                          <div>
                            <div>{selectedOrder.customer.address}</div>
                            {selectedOrder.customer.city && <div>{selectedOrder.customer.city}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className={`text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {language === 'fi' ? 'Tuotteet' : 'Items'}
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-amber-500 font-bold">
                              €{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {item.size && (
                            <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                              {language === 'fi' ? 'Koko' : 'Size'}: {item.size}
                            </div>
                          )}
                          {item.notes && (
                            <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                              💬 {item.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total & Payment */}
                  <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-amber-50' : 'bg-amber-900/20'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {language === 'fi' ? 'Yhteensä' : 'Total'}
                      </span>
                      <span className="text-2xl font-bold text-amber-500">
                        €{selectedOrder.pricing?.total?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {selectedOrder.payment?.method === 'card' ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                      <span>
                        {selectedOrder.payment?.method === 'card'
                          ? (language === 'fi' ? 'Korttimaksu' : 'Card Payment')
                          : (language === 'fi' ? 'Käteismaksu' : 'Cash Payment')
                        }
                      </span>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {selectedOrder.customer.notes && (
                    <div className={`p-4 rounded-lg border-2 border-dashed ${
                      theme === 'light' ? 'border-amber-300 bg-amber-50/50' : 'border-amber-700 bg-amber-900/10'
                    }`}>
                      <div className={`text-sm font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        💬 {language === 'fi' ? 'Asiakkaan viesti' : 'Customer Notes'}
                      </div>
                      <div className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        {selectedOrder.customer.notes}
                      </div>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {selectedOrder.status === 'cancelled' && selectedOrder.rejectionReason && (
                    <div className={`p-4 rounded-lg border-2 ${
                      theme === 'light' ? 'border-red-300 bg-red-50/50' : 'border-red-700 bg-red-900/10'
                    }`}>
                      <div className={`text-sm font-bold mb-2 ${theme === 'light' ? 'text-red-900' : 'text-red-300'}`}>
                        🚫 {language === 'fi' ? 'Hylkäyksen syy' : 'Rejection Reason'}
                      </div>
                      <div className={`text-sm ${theme === 'light' ? 'text-red-800' : 'text-red-200'}`}>
                        {selectedOrder.rejectionReason}
                      </div>
                    </div>
                  )}

                  {/* Customer Review */}
                  {selectedOrder.review && (
                    <div className={`p-4 rounded-lg border-2 ${
                      theme === 'light' ? 'border-green-300 bg-green-50/50' : 'border-green-700 bg-green-900/10'
                    }`}>
                      <div className={`text-sm font-bold mb-2 flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        ⭐ {language === 'fi' ? 'Asiakkaan arvostelu' : 'Customer Review'}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < selectedOrder.review!.rating
                                ? 'fill-amber-400 text-amber-400'
                                : theme === 'light' ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          />
                        ))}
                        <span className={`ml-2 text-sm font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          {selectedOrder.review.rating}/5
                        </span>
                      </div>
                      {selectedOrder.review.comment && (
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          "{selectedOrder.review.comment}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`p-8 rounded-xl border text-center ${
                theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'
              }`}>
                <Package className={`w-16 h-16 mx-auto mb-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`} />
                <p className={`text-lg font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {language === 'fi' ? 'Valitse tilaus nähdäksesi tiedot' : 'Select an order to view details'}
                </p>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Reject Order Dialog */}
        {showRejectDialog && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md rounded-xl shadow-2xl bg-orange-500 border-2 border-orange-600">
              <div className="p-6 border-b border-orange-600">
                <h3 className="text-xl font-bold text-white">
                  {language === 'fi' ? 'Hylkää tilaus' : 'Reject Order'}
                </h3>
                <p className="text-sm mt-2 text-orange-100">
                  {language === 'fi' 
                    ? `Tilaus ${selectedOrder.orderId}` 
                    : `Order ${selectedOrder.orderId}`}
                </p>
              </div>
              
              <div className="p-6">
                <label className="block text-sm font-bold mb-2 text-white">
                  {language === 'fi' ? 'Syy hylkäykseen (asiakkaalle lähetettävä viesti):' : 'Rejection reason (message to customer):'}
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={language === 'fi' 
                    ? 'Esim. Pahoittelemme, emme pysty toimittamaan tilaustasi...' 
                    : 'E.g. Sorry, we cannot fulfill your order...'}
                  className="w-full px-4 py-3 rounded-lg border-2 border-orange-600 resize-none bg-white text-gray-900 placeholder-gray-500 focus:border-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  rows={4}
                />
              </div>
              
              <div className="p-6 border-t border-orange-600 flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectionReason('');
                  }}
                  disabled={rejectingOrder}
                  className="flex-1 px-4 py-3 rounded-lg font-bold transition-colors bg-white text-gray-900 hover:bg-gray-100 border-2 border-orange-600"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                >
                  {language === 'fi' ? 'Peruuta' : 'Cancel'}
                </button>
                <button
                  onClick={handleRejectOrder}
                  disabled={rejectingOrder || !rejectionReason.trim()}
                  className="flex-1 px-4 py-3 bg-gray-900 hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors border-2 border-gray-900"
                  style={{ color: '#ffffff', backgroundColor: rejectingOrder || !rejectionReason.trim() ? '#9ca3af' : '#111827' }}
                >
                  {rejectingOrder 
                    ? (language === 'fi' ? 'Hylätään...' : 'Rejecting...') 
                    : (language === 'fi' ? 'Hylkää tilaus' : 'Reject Order')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Settings Modal */}
        {showSettings && (
          <UserSettings
            language={language}
            theme={theme}
            currentUser={authAPI.getCurrentUser()}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
      </div>
    </>
  );
}
