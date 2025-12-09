import { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle, Truck, ChefHat, Package, X, Star, ThumbsUp, RefreshCw } from 'lucide-react';
import { orderAPI } from '../services/api';
import { socketService } from '../services/socket';

interface OrderTrackingProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  onClose?: () => void;
}

interface OrderStatus {
  orderId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  orderTime: string;
  estimatedTime: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  total: number;
  deliveryMethod: 'delivery' | 'pickup';
  rejectionReason?: string;
}

export function OrderTracking({ language, theme, onClose }: OrderTrackingProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup Socket.IO for real-time updates
  useEffect(() => {
    if (order) {
      // Connect to Socket.IO
      socketService.connect();
      socketService.trackOrder(order.orderId);

      // Listen for order updates
      const handleOrderUpdated = (updatedOrder: any) => {
        if (updatedOrder.orderId === order.orderId) {
          console.log('🔄 Order updated:', updatedOrder);
          setOrder({
            orderId: updatedOrder.orderId,
            status: updatedOrder.status,
            orderTime: new Date(updatedOrder.createdAt).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }),
            estimatedTime: updatedOrder.estimatedTime || getEstimatedTime(updatedOrder.deliveryMethod),
            items: updatedOrder.items,
            total: updatedOrder.pricing?.total || 0,
            deliveryMethod: updatedOrder.deliveryMethod,
            rejectionReason: updatedOrder.rejectionReason
          });
        }
      };

      socketService.onOrderUpdated(handleOrderUpdated);

      return () => {
        socketService.offOrderUpdated(handleOrderUpdated);
      };
    }
  }, [order?.orderId]);

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError(language === 'fi' ? 'Syötä tilausnumero' : 'Enter order number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setNotFound(false);
      
      console.log('🔍 Searching for order:', orderNumber);
      const response = await orderAPI.getOrderById(orderNumber.toUpperCase());
      
      console.log('✅ Order found:', response);
      
      // Map API response to OrderStatus format
      const mappedOrder: OrderStatus = {
        orderId: response.order.orderId,
        status: response.order.status,
        orderTime: new Date(response.order.createdAt).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }),
        estimatedTime: response.order.estimatedTime || getEstimatedTime(response.order.deliveryMethod),
        items: response.order.items,
        total: response.order.pricing?.total || 0,
        deliveryMethod: response.order.deliveryMethod,
        rejectionReason: response.order.rejectionReason
      };
      
      setOrder(mappedOrder);
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Error finding order:', error);
      setOrder(null);
      setNotFound(true);
      setError(error.response?.data?.message || (language === 'fi' ? 'Tilausta ei löytynyt' : 'Order not found'));
      setLoading(false);
    }
  };

  const getEstimatedTime = (deliveryMethod: 'delivery' | 'pickup') => {
    const now = new Date();
    const minutesToAdd = deliveryMethod === 'delivery' ? 45 : 20;
    now.setMinutes(now.getMinutes() + minutesToAdd);
    return now.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', icon: Clock, labelFi: 'Odottaa', labelEn: 'Pending' },
      { key: 'confirmed', icon: CheckCircle, labelFi: 'Vahvistettu', labelEn: 'Confirmed' },
      { key: 'preparing', icon: ChefHat, labelFi: 'Valmistetaan', labelEn: 'Preparing' },
      { key: 'ready', icon: Package, labelFi: 'Valmis', labelEn: 'Ready' },
    ];

    if (order?.deliveryMethod === 'delivery') {
      steps.push({ key: 'delivering', icon: Truck, labelFi: 'Toimitetaan', labelEn: 'Delivering' });
    }

    steps.push({ key: 'completed', icon: CheckCircle, labelFi: 'Valmis', labelEn: 'Completed' });

    return steps;
  };

  const getStatusIndex = (status: string) => {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed'];
    return statuses.indexOf(status);
  };

  const handleConfirmReceived = async () => {
    if (!order) return;
    
    try {
      console.log('✅ Confirming order receipt:', order.orderId);
      await orderAPI.confirmReceipt(order.orderId);
      setOrderConfirmed(true);
      // Show review prompt after confirmation
      setTimeout(() => setShowReview(true), 1000);
    } catch (error) {
      console.error('❌ Error confirming order:', error);
      alert(language === 'fi' 
        ? 'Vahvistus epäonnistui. Yritä uudelleen!' 
        : 'Confirmation failed. Please try again!');
    }
  };

  const handleSubmitReview = async () => {
    if (!order || rating === 0) {
      alert(language === 'fi' ? 'Valitse arvosana!' : 'Please select a rating!');
      return;
    }
    
    try {
      console.log('⭐ Submitting review:', { orderId: order.orderId, rating, comment: review });
      await orderAPI.addReview(order.orderId, rating, review || undefined);
      
      setShowReview(false);
      alert(language === 'fi' ? 'Kiitos arvostelustasi!' : 'Thank you for your review!');
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      alert(language === 'fi' 
        ? 'Arvostelun lähetys epäonnistui!' 
        : 'Failed to submit review!');
    }
  };

  return (
    <div className="min-h-screen py-20" style={{ background: '#fafafa' }}>
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-24 right-8 p-3 rounded-full transition-all transform hover:scale-110 shadow-lg z-50"
          style={{
            background: 'linear-gradient(135deg, #DC2626, #F97316)',
            color: 'white',
            border: '3px solid white'
          }}
          aria-label={language === 'fi' ? 'Sulje' : 'Close'}
        >
          <X className="w-6 h-6" />
        </button>
      )}
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#111827' }}>
            {language === 'fi' ? 'Seuraa tilaustasi' : 'Track Your Order'}
          </h1>
          <p className="text-lg" style={{ color: '#4b5563' }}>
            {language === 'fi' 
              ? 'Syötä tilausnumerosi nähdäksesi tilauksen tilan'
              : 'Enter your order number to see order status'}
          </p>
        </div>

        {/* Search Section */}
        <div className="p-8 rounded-2xl shadow-lg border mb-8" style={{ background: 'white', borderColor: '#e5e7eb' }}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold mb-3" style={{ color: '#111827' }}>
                {language === 'fi' ? 'Tilausnumero' : 'Order Number'}
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-amber-500/50 focus:outline-none uppercase"
                  style={{
                    background: 'white',
                    borderColor: '#d1d5db',
                    color: '#111827'
                  }}
                  placeholder="VP12345"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    {language === 'fi' ? 'Haetaan...' : 'Searching...'}
                  </span>
                ) : (
                  language === 'fi' ? 'Hae' : 'Search'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {notFound && !error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400">
                {language === 'fi' 
                  ? 'Tilausta ei löytynyt. Tarkista tilausnumero.'
                  : 'Order not found. Please check your order number.'}
              </p>
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className={`p-8 rounded-2xl shadow-lg border ${
            theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'
          }`}>
            {/* Order Info */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {language === 'fi' ? 'Tilaus' : 'Order'} #{order.orderId}
                </h2>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Clock className="w-4 h-4 inline mr-1" />
                  {language === 'fi' ? 'Tilattu klo' : 'Ordered at'} {order.orderTime}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {language === 'fi' ? 'Arvioitu aika' : 'Estimated time'}
                </div>
                <div className="text-2xl font-bold text-amber-500">
                  {order.estimatedTime}
                </div>
              </div>
            </div>

            {/* Status Progress */}
            <div className="mb-8">
              <h3 className={`text-lg font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {language === 'fi' ? 'Tilauksen tila' : 'Order Status'}
              </h3>
              <div className="relative">
                {/* Progress Line - Background */}
                <div className={`absolute top-6 left-0 right-0 h-1 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                
                {/* Progress Line - Completed portion (Green) */}
                <div 
                  className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(getStatusIndex(order.status) / (getStatusSteps().length - 1)) * 100}%` }}
                />
                
                {/* Status Steps */}
                <div className="relative flex justify-between">
                  {getStatusSteps().map((step, index) => {
                    const Icon = step.icon;
                    const currentIndex = getStatusIndex(order.status);
                    const isCompleted = currentIndex > index;
                    const isCurrent = currentIndex === index;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all shadow-lg
                            ${isCompleted 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                              : isCurrent 
                              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' 
                              : theme === 'light'
                              ? 'bg-gray-200 text-gray-400'
                              : 'bg-gray-700 text-gray-500'
                            } 
                            ${isCurrent ? 'ring-4 ring-amber-500/30 scale-110 animate-pulse' : ''}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-bold text-center
                          ${isCompleted 
                            ? theme === 'light' ? 'text-green-600' : 'text-green-400'
                            : isCurrent 
                            ? theme === 'light' ? 'text-amber-600' : 'text-amber-400'
                            : theme === 'light' ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                          {language === 'fi' ? step.labelFi : step.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className={`border-t pt-6 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <h3 className={`text-lg font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {language === 'fi' ? 'Tilauksen sisältö' : 'Order Items'}
              </h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                      {item.quantity}x {item.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className={`mt-4 pt-4 border-t flex justify-between ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                <span className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {language === 'fi' ? 'Yhteensä' : 'Total'}
                </span>
                <span className="font-bold text-lg text-amber-500">
                  €{order.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Delivery Method Badge */}
            <div className="mt-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                order.deliveryMethod === 'delivery'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {order.deliveryMethod === 'delivery'
                  ? language === 'fi' ? '🚚 Kotiinkuljetus' : '🚚 Home Delivery'
                  : language === 'fi' ? '🏪 Nouto ravintolasta' : '🏪 Restaurant Pickup'}
              </span>
            </div>

            {/* Rejection Message - Show when order is cancelled */}
            {order.status === 'cancelled' && order.rejectionReason && (
              <div className={`mt-6 p-4 rounded-xl border-2 ${
                theme === 'light' 
                  ? 'bg-red-50 border-red-300' 
                  : 'bg-red-900/20 border-red-700'
              }`}>
                <div className={`text-sm font-bold mb-2 flex items-center gap-2 ${
                  theme === 'light' ? 'text-red-900' : 'text-red-300'
                }`}>
                  🚫 {language === 'fi' ? 'Tilaus peruttu' : 'Order Cancelled'}
                </div>
                <div className={`text-sm ${theme === 'light' ? 'text-red-800' : 'text-red-200'}`}>
                  {order.rejectionReason}
                </div>
              </div>
            )}

            {/* Action Buttons - Show when order is completed */}
            {order.status === 'completed' && (
              <div className={`mt-6 pt-6 border-t space-y-3 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                {!orderConfirmed ? (
                  <button
                    onClick={handleConfirmReceived}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-3"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    {language === 'fi' ? 'Vahvista tilaus vastaanotettu' : 'Confirm Order Received'}
                  </button>
                ) : (
                  <div className={`p-4 rounded-xl border-2 border-green-500 ${theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'}`}>
                    <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        {language === 'fi' ? 'Tilaus vahvistettu vastaanotetuksi' : 'Order confirmed as received'}
                      </span>
                    </div>
                  </div>
                )}

                {!showReview ? (
                  <button
                    onClick={() => setShowReview(true)}
                    className={`w-full font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-3 ${
                      theme === 'light'
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                    {language === 'fi' ? 'Jätä arvostelu' : 'Leave a Review'}
                  </button>
                ) : (
                  <div className={`p-6 rounded-xl border-2 ${
                    theme === 'light' 
                      ? 'bg-white border-amber-200' 
                      : 'bg-gray-800 border-amber-800'
                  }`}>
                    <h4 className={`font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {language === 'fi' ? 'Arvostele tilaus' : 'Rate Your Order'}
                    </h4>
                    
                    {/* Star Rating */}
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="transform hover:scale-110 transition-all"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              star <= rating 
                                ? 'fill-amber-500 text-amber-500' 
                                : theme === 'light' 
                                ? 'text-gray-300' 
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Review Text */}
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder={language === 'fi' ? 'Kerro kokemuksestasi...' : 'Tell us about your experience...'}
                      className={`w-full p-4 rounded-xl border-2 mb-4 resize-none focus:ring-2 focus:ring-amber-500/50 focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-gray-900 border-gray-700 text-white'
                      }`}
                      rows={4}
                    />

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmitReview}
                        disabled={rating === 0}
                        className={`flex-1 font-bold py-3 px-6 rounded-xl transition-all ${
                          rating === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg transform hover:scale-105'
                        }`}
                      >
                        {language === 'fi' ? 'Lähetä arvostelu' : 'Submit Review'}
                      </button>
                      <button
                        onClick={() => setShowReview(false)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${
                          theme === 'light'
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        {language === 'fi' ? 'Peruuta' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
