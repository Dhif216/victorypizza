import { useState } from 'react';
import { orderAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, CreditCard, Truck, Store, User, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

interface CheckoutPageProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  onBack: () => void;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

type DeliveryMethod = 'delivery' | 'pickup';
type PaymentMethod = 'card' | 'cash';

export function CheckoutPage({ language, theme, onBack }: CheckoutPageProps) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const deliveryFee = deliveryMethod === 'delivery' ? 5.0 : 0;
  const totalPrice = getTotalPrice() + deliveryFee;

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const orderData = {
        deliveryMethod,
        customer: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email,
          address: customerInfo.address,
          city: customerInfo.city,
          notes: customerInfo.notes,
        },
        items: cartItems.map(item => ({
          name: language === 'fi' ? item.nameFi : item.nameEn,
          quantity: item.quantity,
          size: item.selectedSize,
          price: item.selectedPrice,
          notes: item.notes,
        })),
        payment: {
          method: paymentMethod,
        },
        pricing: {
          subtotal: getTotalPrice(),
          deliveryFee: deliveryFee,
          total: totalPrice,
        },
      };
      const response = await orderAPI.createOrder(orderData);
      setOrderId(response.orderId);
      setOrderSuccess(true);
      clearCart();
      setIsSubmitting(false);
      // Reset to menu after 10 seconds
      setTimeout(() => {
        onBack();
        setOrderSuccess(false);
        setOrderId(null);
      }, 10000);
    } catch (error) {
      setIsSubmitting(false);
      alert(language === 'fi' ? 'Tilauksen lähetys epäonnistui.' : 'Order submission failed.');
    }
  };

  const isFormValid = () => {
    if (!customerInfo.name || !customerInfo.phone) return false;
    if (deliveryMethod === 'delivery' && (!customerInfo.address || !customerInfo.city)) return false;
    return true;
  };

  if (orderSuccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${
        theme === 'light' ? 'bg-gray-50' : 'bg-black'
      }`}>
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
            {language === 'fi' ? 'Tilaus vastaanotettu!' : 'Order received!'}
          </h2>
          {orderId && (
            <div className="my-4">
              <div className={`text-lg font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>{language === 'fi' ? 'Tilausnumerosi' : 'Your Order Number'}</div>
              <div className="text-2xl font-bold text-amber-500 select-all">{orderId}</div>
              <div className={`text-xs mt-2 ${theme === 'light' ? 'text-black/60' : 'text-white/60'}`}>{language === 'fi' ? '💾 Tallenna tämä numero tilauksesi seuraamiseen' : '💾 Save this number to track your order'}</div>
            </div>
          )}
          <p className={`text-lg ${theme === 'light' ? 'text-black/60' : 'text-white/60'}`}>
            {language === 'fi' 
              ? 'Kiitos tilauksestasi! Otamme sinuun yhteyttä pian.'
              : 'Thank you for your order! We will contact you soon.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-20 px-6 ${theme === 'light' ? 'bg-gray-50' : 'bg-black'}`}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'hover:bg-gray-200'
                : 'hover:bg-neutral-800'
            }`}
          >
            <ArrowLeft className={theme === 'light' ? 'text-black' : 'text-white'} />
          </button>
          <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'light' ? 'text-black' : 'text-white'}`}>
            {language === 'fi' ? 'Kassa' : 'Checkout'}
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Customer Info */}
          <div className="space-y-6">
            {/* Delivery Method */}
            <div className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                {language === 'fi' ? 'Toimitustapa' : 'Delivery Method'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'border-amber-500 bg-amber-500/10'
                      : theme === 'light'
                        ? 'border-gray-300 hover:border-amber-500/50'
                        : 'border-neutral-700 hover:border-amber-500/50'
                  }`}
                >
                  <Truck className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <div className={`font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    {language === 'fi' ? 'Kotiinkuljetus' : 'Delivery'}
                  </div>
                  <div className="text-sm text-amber-500">+5.00€</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-amber-500 bg-amber-500/10'
                      : theme === 'light'
                        ? 'border-gray-300 hover:border-amber-500/50'
                        : 'border-neutral-700 hover:border-amber-500/50'
                  }`}
                >
                  <Store className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <div className={`font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    {language === 'fi' ? 'Nouto' : 'Pickup'}
                  </div>
                  <div className="text-sm text-green-500">{language === 'fi' ? 'Ilmainen' : 'Free'}</div>
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                {language === 'fi' ? 'Yhteystiedot' : 'Contact Information'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    <User className="w-4 h-4 inline mr-2" />
                    {language === 'fi' ? 'Nimi' : 'Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-black focus:border-amber-500'
                        : 'bg-neutral-800 border-neutral-700 text-white focus:border-amber-500'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    <Phone className="w-4 h-4 inline mr-2" />
                    {language === 'fi' ? 'Puhelin' : 'Phone'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-black focus:border-amber-500'
                        : 'bg-neutral-800 border-neutral-700 text-white focus:border-amber-500'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    <Mail className="w-4 h-4 inline mr-2" />
                    {language === 'fi' ? 'Sähköposti' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-black focus:border-amber-500'
                        : 'bg-neutral-800 border-neutral-700 text-white focus:border-amber-500'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                  />
                </div>

                {deliveryMethod === 'delivery' && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                        <MapPin className="w-4 h-4 inline mr-2" />
                        {language === 'fi' ? 'Osoite' : 'Address'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'light'
                            ? 'bg-white border-gray-300 text-black focus:border-amber-500'
                            : 'bg-neutral-800 border-neutral-700 text-white focus:border-amber-500'
                        } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                        {language === 'fi' ? 'Kaupunki/Postinumero' : 'City/Postal Code'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder={language === 'fi' ? 'esim. Vantaa 01234' : 'e.g. Vantaa 01234'}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'light'
                            ? 'bg-white border-gray-300 text-black focus:border-amber-500'
                            : 'bg-neutral-800 border-neutral-700 text-white focus:border-amber-500'
                        } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    {language === 'fi' ? 'Lisätiedot' : 'Additional Notes'}
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-black focus:border-amber-500'
                        : 'bg-neutral-800 border-neutral-700 text-white focus:border-amber-500'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                {language === 'fi' ? 'Maksutapa' : 'Payment Method'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-500/10'
                      : theme === 'light'
                        ? 'border-gray-300 hover:border-amber-500/50'
                        : 'border-neutral-700 hover:border-amber-500/50'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <div className={`font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    {language === 'fi' ? 'Kortti' : 'Card'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-amber-500 bg-amber-500/10'
                      : theme === 'light'
                        ? 'border-gray-300 hover:border-amber-500/50'
                        : 'border-neutral-700 hover:border-amber-500/50'
                  }`}
                >
                  <div className="text-2xl mb-2">💵</div>
                  <div className={`font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                    {language === 'fi' ? 'Käteinen' : 'Cash'}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className={`p-6 rounded-2xl border sticky top-24 ${
              theme === 'light' ? 'bg-white border-gray-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                {language === 'fi' ? 'Tilausyhteenveto' : 'Order Summary'}
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className={`flex gap-4 pb-4 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-neutral-800'
                  }`}>
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.nameFi}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className={`font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                        {language === 'fi' ? item.nameFi : item.nameEn}
                      </div>
                      <div className={`text-sm ${theme === 'light' ? 'text-black/60' : 'text-white/60'}`}>
                        {item.selectedSize === 'single' ? '' : `${item.selectedSize} • `}
                        {language === 'fi' ? 'Määrä' : 'Qty'}: {item.quantity}
                      </div>
                      {item.notes && (
                        <div className={`text-xs mt-1 ${theme === 'light' ? 'text-black/50' : 'text-white/50'}`}>
                          {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-amber-500 font-bold">
                      {(item.selectedPrice * item.quantity).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className={`flex justify-between ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                  <span>{language === 'fi' ? 'Välisumma' : 'Subtotal'}</span>
                  <span>{getTotalPrice().toFixed(2)}€</span>
                </div>
                <div className={`flex justify-between ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                  <span>{language === 'fi' ? 'Toimitusmaksu' : 'Delivery Fee'}</span>
                  <span className={deliveryFee === 0 ? 'text-green-500' : ''}>
                    {deliveryFee === 0 ? (language === 'fi' ? 'Ilmainen' : 'Free') : `${deliveryFee.toFixed(2)}€`}
                  </span>
                </div>
                <div className={`flex justify-between text-xl font-bold pt-3 border-t ${
                  theme === 'light' ? 'text-black border-gray-200' : 'text-white border-neutral-800'
                }`}>
                  <span>{language === 'fi' ? 'Yhteensä' : 'Total'}</span>
                  <span className="text-amber-500">{totalPrice.toFixed(2)}€</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 ${
                  isSubmitting ? 'opacity-75' : ''
                }`}
              >
                {isSubmitting 
                  ? (language === 'fi' ? 'Käsitellään...' : 'Processing...') 
                  : (language === 'fi' ? 'Vahvista tilaus' : 'Confirm Order')}
              </button>

              <p className={`text-xs text-center mt-4 ${theme === 'light' ? 'text-black/50' : 'text-white/50'}`}>
                {language === 'fi' 
                  ? 'Vahvistamalla tilauksen hyväksyt käyttöehdot'
                  : 'By confirming your order, you agree to our terms'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
