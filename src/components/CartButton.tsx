import { ShoppingCart, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { MenuItem } from '../data/menuData';

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: string;
  selectedPrice: number;
  notes?: string;
}

interface CartButtonProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number, selectedSize?: string) => void;
  onRemoveItem: (id: number, selectedSize?: string) => void;
  onCheckout: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function CartButton({ 
  language, 
  theme, 
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
            className={`fixed inset-0 ${
              theme === 'light' ? 'bg-gray-900' : 'bg-black'
            }`}
            style={{ opacity: 0.95, zIndex: 99998 }}
            onClick={toggleOpen}
          />
          
          <div 
            className={`fixed top-0 right-0 h-full w-full sm:w-[450px] shadow-2xl transform transition-transform duration-300 ${
              theme === 'light' ? 'bg-white' : 'bg-gray-900'
            }`}
            style={{ zIndex: 99999 }}
          >
            {/* Header */}
            <div className={`p-6 border-b ${theme === 'light' ? 'border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50' : 'border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {language === 'fi' ? 'Ostoskori' : 'Shopping Cart'}
                  </h2>
                  <p className="text-sm text-amber-500 font-medium mt-1">
                    {totalItems} {language === 'fi' ? 'tuote(tta)' : 'item(s)'}
                  </p>
                </div>
                <button 
                  onClick={toggleOpen} 
                  className={`p-2 rounded-full hover:bg-gray-200/50 transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 250px)' }}>
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-center text-gray-500 text-lg font-medium">
                    {language === 'fi' ? 'Ostoskori on tyhjä' : 'Your cart is empty'}
                  </p>
                  <p className="text-center text-gray-400 text-sm mt-2">
                    {language === 'fi' ? 'Lisää tuotteita aloittaaksesi tilauksen' : 'Add items to start your order'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border transition-all hover:shadow-lg ${
                        theme === 'light' 
                          ? 'bg-white border-gray-200 hover:border-amber-300' 
                          : 'bg-gray-800 border-gray-700 hover:border-amber-600'
                      }`}
                    >
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <div className="flex-shrink-0">
                            <img 
                              src={item.imageUrl} 
                              alt={item.nameFi}
                              className="w-28 h-28 object-cover rounded-xl border-2 border-amber-500/20"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold text-lg leading-tight mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {language === 'fi' ? item.nameFi : item.nameEn}
                          </h3>
                          {item.selectedSize && (
                            <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                              <span className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 font-semibold text-sm border border-amber-500/30">
                                {item.selectedSize}
                              </span>
                            </p>
                          )}
                          {item.notes && (
                            <p className={`text-xs mt-2 italic line-clamp-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              "{item.notes}"
                            </p>
                          )}
                          <p className="text-amber-500 font-bold text-lg mt-3">€{item.selectedPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                            className="p-2 bg-white dark:bg-gray-600 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                          </button>
                          <span className={`w-10 text-center font-bold text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                            className="p-2 bg-white dark:bg-gray-600 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id, item.selectedSize)}
                          className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group flex-shrink-0"
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
              <div className={`p-6 border-t ${theme === 'light' ? 'border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50' : 'border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900'}`}>
                <div className={`flex justify-between mb-6 p-4 rounded-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                  <span className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {language === 'fi' ? 'Yhteensä' : 'Total'}:
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    toggleOpen();
                    onCheckout();
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                >
                  <span className="text-lg">{language === 'fi' ? 'Siirry kassalle' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
