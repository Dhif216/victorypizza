import { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, User, MessageSquare, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import type { CartItem } from './CartButton';
import { orderAPI } from '../services/api';

interface CheckoutPageProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  cartItems: CartItem[];
  onBack: () => void;
  onClearCart: () => void;
  onTrackOrder?: () => void;
}

export function CheckoutPage({ language, theme, cartItems, onBack, onClearCart, onTrackOrder }: CheckoutPageProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });

  const deliveryFee = deliveryMethod === 'delivery' ? 5 : 0;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.selectedPrice * item.quantity), 0);
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone) {
      alert(language === 'fi' ? 'Täytä pakolliset kentät!' : 'Please fill required fields!');
      return;
    }
    
    if (deliveryMethod === 'delivery' && (!formData.address || !formData.city)) {
      alert(language === 'fi' ? 'Täytä toimitusosoite!' : 'Please fill delivery address!');
      return;
    }

    // Create order object for API (matching backend schema)
    const orderData = {
      deliveryMethod,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        notes: formData.notes
      },
      items: cartItems.map(item => ({
        name: language === 'fi' ? item.nameFi : item.nameEn,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.selectedPrice,
        notes: item.notes
      })),
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      pricing: {
        subtotal,
        deliveryFee,
        total
      }
    };

    try {
      // Send order to backend API
      const response = await orderAPI.createOrder(orderData);
      
      // Set the order number from the API response
      setOrderNumber(response.order.orderId);

      console.log('✅ Order created successfully:', response);

      // Show success message
      setOrderSubmitted(true);
      
    } catch (error: any) {
      console.error('❌ Error creating order:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Order data sent:', orderData);
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      
      alert(language === 'fi' 
        ? `Tilauksen lähetys epäonnistui: ${errorMessage}\n\nYritä uudelleen!` 
        : `Failed to submit order: ${errorMessage}\n\nPlease try again!`);
    }
  };

  if (orderSubmitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'light' ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50' : 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
      }`}>
        <div className="text-center max-w-md">
          <div className="mb-8 relative">
            <div className="absolute inset-0 animate-ping">
              <CheckCircle className="w-32 h-32 mx-auto text-green-500/30" />
            </div>
            <CheckCircle className="w-32 h-32 mx-auto text-green-500 relative animate-bounce" />
          </div>
          <h2 className={`text-4xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {language === 'fi' ? '🎉 Tilaus vastaanotettu!' : '🎉 Order Received!'}
          </h2>
          
          {/* Order Number Display */}
          <div className={`p-6 rounded-xl mb-6 ${theme === 'light' ? 'bg-white shadow-lg' : 'bg-gray-800'}`}>
            <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {language === 'fi' ? 'Tilausnumerosi' : 'Your Order Number'}
            </p>
            <p className="text-4xl font-bold text-amber-500 mb-2 tracking-wider">
              {orderNumber}
            </p>
            <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
              {language === 'fi' 
                ? '💾 Tallenna tämä numero tilauksesi seuraamiseen'
                : '💾 Save this number to track your order'}
            </p>
          </div>

          <p className={`text-xl mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {language === 'fi' 
              ? 'Kiitos tilauksestasi!' 
              : 'Thank you for your order!'}
          </p>
          <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {language === 'fi' 
              ? 'Otamme sinuun yhteyttä pian.' 
              : 'We will contact you soon.'}
          </p>
          
          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <button
              onClick={() => {
                if (onTrackOrder) {
                  onClearCart();
                  onTrackOrder();
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {language === 'fi' ? 'Seuraa tilausta' : 'Track My Order'}
            </button>
            
            <button
              onClick={() => {
                onClearCart();
                onBack();
              }}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 ${
                theme === 'light'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-500'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              {language === 'fi' ? 'Palaa etusivulle' : 'Back to Homepage'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-20 ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-amber-50/30 to-orange-50/30' : 'bg-gradient-to-br from-black via-gray-900 to-black'}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all hover:scale-105 ${
              theme === 'light' 
                ? 'text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 shadow-sm' 
                : 'text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{language === 'fi' ? 'Takaisin ostoskoriin' : 'Back to Cart'}</span>
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-amber-500' : 'bg-amber-600'}`}>
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {language === 'fi' ? 'Maksusivu' : 'Checkout'}
              </h1>
              <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {language === 'fi' ? 'Täytä tietosi ja viimeistele tilaus' : 'Complete your order details'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Method */}
            <div className={`p-8 rounded-2xl shadow-lg border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                <MapPin className="w-6 h-6 text-amber-500" />
                {language === 'fi' ? 'Toimitustapa' : 'Delivery Method'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                    deliveryMethod === 'delivery'
                      ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-lg'
                      : theme === 'light'
                      ? 'border-gray-200 hover:border-amber-300 bg-gray-50'
                      : 'border-gray-700 hover:border-amber-600 bg-gray-800'
                  }`}
                >
                  <MapPin className={`w-8 h-8 mb-3 mx-auto ${deliveryMethod === 'delivery' ? 'text-amber-500' : 'text-gray-400'}`} />
                  <div className={`font-bold text-lg mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {language === 'fi' ? 'Kotiinkuljetus' : 'Home Delivery'}
                  </div>
                  <div className="text-sm text-amber-500 font-semibold">+€5.00</div>
                  <div className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {language === 'fi' ? '30-45 min' : '30-45 min'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                    deliveryMethod === 'pickup'
                      ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-lg'
                      : theme === 'light'
                      ? 'border-gray-200 hover:border-amber-300 bg-gray-50'
                      : 'border-gray-700 hover:border-amber-600 bg-gray-800'
                  }`}
                >
                  <User className={`w-8 h-8 mb-3 mx-auto ${deliveryMethod === 'pickup' ? 'text-amber-500' : 'text-gray-400'}`} />
                  <div className={`font-bold text-lg mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {language === 'fi' ? 'Nouto ravintolasta' : 'Restaurant Pickup'}
                  </div>
                  <div className="text-sm text-green-500 font-semibold">{language === 'fi' ? 'Ilmainen' : 'Free'}</div>
                  <div className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {language === 'fi' ? '15-20 min' : '15-20 min'}
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Info */}
            <form onSubmit={handleSubmit} className={`p-8 rounded-2xl shadow-lg border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                <User className="w-6 h-6 text-amber-500" />
                {language === 'fi' ? 'Yhteystiedot' : 'Contact Information'}
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {language === 'fi' ? 'Nimi *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-amber-500/50 focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border-gray-300 text-gray-900 focus:border-amber-500'
                          : 'bg-gray-800 border-gray-700 text-white focus:border-amber-500'
                      }`}
                      placeholder={language === 'fi' ? 'Matti Meikäläinen' : 'John Doe'}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {language === 'fi' ? 'Puhelinnumero *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-amber-500/50 focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border-gray-300 text-gray-900 focus:border-amber-500'
                          : 'bg-gray-800 border-gray-700 text-white focus:border-amber-500'
                      }`}
                      placeholder="+358 40 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {language === 'fi' ? 'Sähköposti' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-amber-500/50 focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border-gray-300 text-gray-900 focus:border-amber-500'
                          : 'bg-gray-800 border-gray-700 text-white focus:border-amber-500'
                      }`}
                      placeholder="matti@example.com"
                    />
                  </div>
                </div>

                {deliveryMethod === 'delivery' && (
                  <>
                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {language === 'fi' ? 'Osoite *' : 'Address *'}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input
                          type="text"
                          required={deliveryMethod === 'delivery'}
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-amber-500/50 focus:outline-none ${
                            theme === 'light'
                              ? 'bg-white border-gray-300 text-gray-900 focus:border-amber-500'
                              : 'bg-gray-800 border-gray-700 text-white focus:border-amber-500'
                          }`}
                          placeholder={language === 'fi' ? 'Katuosoite 1' : 'Street Address 1'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {language === 'fi' ? 'Kaupunki/Postinumero *' : 'City/Postal Code *'}
                      </label>
                      <input
                        type="text"
                        required={deliveryMethod === 'delivery'}
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className={`w-full px-4 py-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-amber-500/50 focus:outline-none ${
                          theme === 'light'
                            ? 'bg-white border-gray-300 text-gray-900 focus:border-amber-500'
                            : 'bg-gray-800 border-gray-700 text-white focus:border-amber-500'
                        }`}
                        placeholder={language === 'fi' ? 'esim. Vantaa 01234' : 'e.g. Helsinki 00100'}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className={`block text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {language === 'fi' ? 'Lisätiedot' : 'Additional Notes'}
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-amber-500" />
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 resize-none transition-all focus:ring-2 focus:ring-amber-500/50 focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border-gray-300 text-gray-900 focus:border-amber-500'
                          : 'bg-gray-800 border-gray-700 text-white focus:border-amber-500'
                      }`}
                      placeholder={language === 'fi' ? 'Esim. ovikoodi, kerros...' : 'e.g. door code, floor...'}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className={`mt-8 pt-8 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  <CreditCard className="w-6 h-6 text-amber-500" />
                  {language === 'fi' ? 'Maksutapa' : 'Payment Method'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-lg'
                        : theme === 'light'
                        ? 'border-gray-200 hover:border-amber-300 bg-gray-50'
                        : 'border-gray-700 hover:border-amber-600 bg-gray-800'
                    }`}
                  >
                    <CreditCard className={`w-8 h-8 mb-3 mx-auto ${paymentMethod === 'card' ? 'text-amber-500' : 'text-gray-400'}`} />
                    <div className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {language === 'fi' ? 'Korttimaksu' : 'Card Payment'}
                    </div>
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Visa, Mastercard
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                      paymentMethod === 'cash'
                        ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-lg'
                        : theme === 'light'
                        ? 'border-gray-200 hover:border-amber-300 bg-gray-50'
                        : 'border-gray-700 hover:border-amber-600 bg-gray-800'
                    }`}
                  >
                    <Banknote className={`w-8 h-8 mb-3 mx-auto ${paymentMethod === 'cash' ? 'text-amber-500' : 'text-gray-400'}`} />
                    <div className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {language === 'fi' ? 'Käteinen' : 'Cash'}
                    </div>
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {language === 'fi' ? 'Toimituksessa' : 'On delivery'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-8 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-bold py-5 px-8 rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-[1.02] text-lg"
              >
                <span className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  {language === 'fi' ? 'Vahvista tilaus' : 'Confirm Order'}
                </span>
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className={`p-8 rounded-2xl sticky top-24 shadow-lg border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {language === 'fi' ? 'Tilausyhteenveto' : 'Order Summary'}
              </h2>
              
              <div className={`space-y-4 mb-6 pb-6 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                    {item.imageUrl && (
                      <div className="flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.nameFi}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm leading-tight mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {language === 'fi' ? item.nameFi : item.nameEn}
                      </div>
                      <div className="text-xs text-amber-500 mt-1 mb-1">
                        <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 font-medium">
                          {item.selectedSize}
                        </span>
                      </div>
                      <div className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {item.quantity}x €{item.selectedPrice.toFixed(2)}
                      </div>
                      <div className="text-sm font-bold text-amber-500 mt-0.5">
                        €{(item.selectedPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className={`flex justify-between text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  <span>{language === 'fi' ? 'Välisumma' : 'Subtotal'}</span>
                  <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  <span>{language === 'fi' ? 'Toimitus' : 'Delivery'}</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-500' : ''}`}>
                    {deliveryFee === 0 ? (language === 'fi' ? 'Ilmainen' : 'Free') : `€${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className={`flex justify-between text-2xl font-bold pt-4 mt-4 border-t ${
                  theme === 'light' ? 'text-gray-900 border-gray-200' : 'text-white border-gray-700'
                }`}>
                  <span>{language === 'fi' ? 'Yhteensä' : 'Total'}</span>
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    €{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-xl ${theme === 'light' ? 'bg-amber-50' : 'bg-amber-900/20'}`}>
                <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {language === 'fi' 
                    ? '🔒 Tietosi käsitellään turvallisesti' 
                    : '🔒 Your information is processed securely'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
