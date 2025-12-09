import { ShoppingCart, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { MenuItem } from '../data/menuData';

export interface CartItem extends MenuItem {
  cartItemId: string;
  quantity: number;
  selectedSize?: string;
  selectedPrice: number;
  notes?: string;
}

interface CartButtonProps {
  language: 'fi' | 'en';
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function CartButton({ 
  language, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout,
  isOpen: externalIsOpen,
  onToggle
}: CartButtonProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const toggleOpen = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cart-open');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.classList.remove('cart-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.classList.remove('cart-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.selectedPrice * item.quantity), 0);

  return (
    <>
      {/* CART BUTTON - ALWAYS VISIBLE */}
      <div 
        onClick={toggleOpen}
        className="fixed top-32 right-6 bg-amber-500 text-white p-4 rounded-full cursor-pointer shadow-2xl hover:bg-amber-600 transition-all"
        style={{ zIndex: 10000 }}
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            {totalItems}
          </div>
        )}
      </div>

      {/* CART DRAWER */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black" 
            style={{ zIndex: 99998 }}
            onClick={toggleOpen}
          />
          
          <div 
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] shadow-2xl transform transition-transform duration-300 border-l bg-white border-gray-200 text-gray-900"
            style={{ zIndex: 99999, boxShadow: '0 20px 45px rgba(0,0,0,0.35)', backgroundColor: '#ffffff', color: '#f97316' }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-orange-500">
                    {language === 'fi' ? 'Ostoskori' : 'Shopping Cart'}
                  </h2>
                  <p className="text-sm text-orange-500 font-semibold mt-1">
                    {totalItems} {language === 'fi' ? 'tuote(tta)' : 'item(s)'}
                  </p>
                </div>
                <button 
                  onClick={toggleOpen} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)', minHeight: '120px', overflowY: 'auto', scrollbarWidth: 'thin', height: 'auto' }}>
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 bg-gray-100">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-center text-gray-700 text-lg font-medium">
                    {language === 'fi' ? 'Ostoskori on tyhjä' : 'Your cart is empty'}
                  </p>
                  <p className="text-center text-gray-500 text-sm mt-2">
                    {language === 'fi' ? 'Lisää tuotteita aloittaaksesi tilauksen' : 'Add items to start your order'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.cartItemId}
                      className="p-4 rounded-xl border transition-all hover:shadow-lg bg-white border-gray-200 hover:border-emerald-500"
                    >
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <div className="flex-shrink-0">
                            <img 
                              src={item.imageUrl} 
                              alt={item.nameFi}
                              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #ffa726', background: '#fff' }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg leading-tight mb-2 text-gray-900">
                            {language === 'fi' ? item.nameFi : item.nameEn}
                          </h3>
                          {item.selectedSize && (
                            <p className="text-sm mt-2 text-gray-700">
                              <span className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-semibold text-sm border border-emerald-200">
                                {item.selectedSize}
                              </span>
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-xs mt-2 italic line-clamp-2 text-gray-600">
                              "{item.notes}"
                            </p>
                          )}
                          <p className="text-emerald-600 font-black text-2xl mt-3">€{item.selectedPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1.5">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-2 bg-gray-200 rounded-md hover:bg-emerald-100 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="w-10 text-center font-bold text-base text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-2 bg-gray-200 rounded-md hover:bg-emerald-100 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors group flex-shrink-0"
                          title={language === 'fi' ? 'Poista' : 'Remove'}
                        >
                          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex justify-between mb-6 p-4 rounded-lg border bg-gray-50 border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">
                    {language === 'fi' ? 'Yhteensä' : 'Total'}:
                  </span>
                  <span className="text-3xl font-extrabold text-emerald-600">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    toggleOpen();
                    onCheckout();
                  }}
                  className="w-full text-white font-bold flex items-center justify-center gap-3"
                  style={{
                    zIndex: 100005,
                    backgroundColor: '#f97316',
                    color: '#ffffff',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: '2px solid #ea580c',
                    boxShadow: '0 12px 28px rgba(249, 115, 22, 0.45)',
                    transform: 'translateZ(0)',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease',
                    backgroundImage: 'none',
                    opacity: 1,
                    position: 'relative',
                    overflow: 'visible',
                    pointerEvents: 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 14px 32px rgba(249, 115, 22, 0.55)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateZ(0)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(249, 115, 22, 0.45)';
                  }}
                >
                  <span className="text-lg" style={{ position: 'relative', zIndex: 1 }}>
                    {language === 'fi' ? 'Siirry kassalle' : 'Proceed to Checkout'}
                  </span>
                  <ArrowRight className="w-6 h-6" style={{ position: 'relative', zIndex: 1 }} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
