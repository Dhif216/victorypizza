import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

interface CartDrawerProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
}

export function CartDrawer({ language, theme }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

  const totalItems = getTotalItems();

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-24 right-8 z-40 p-4 rounded-full shadow-2xl transition-all ${
          theme === 'light'
            ? 'bg-amber-500 hover:bg-amber-600 text-white'
            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black'
        }`}
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[150] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-neutral-900 shadow-2xl z-[200] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-neutral-800 px-6 py-4 flex justify-between items-center border-b border-amber-500/20">
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              {language === 'fi' ? 'Ostoskori' : 'Shopping Cart'}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center text-white/50 mt-20">
                <ShoppingCart className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p>{language === 'fi' ? 'Ostoskori on tyhjä' : 'Cart is empty'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.id}-${item.selectedSize}-${index}`}
                    className="bg-neutral-800 rounded-lg p-4 border border-amber-500/20"
                  >
                    <div className="flex gap-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={language === 'fi' ? item.nameFi : item.nameEn}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-white font-bold">
                          {language === 'fi' ? item.nameFi : item.nameEn}
                        </h3>
                        <p className="text-white/50 text-sm">
                          {item.selectedSize === 'norm' && (language === 'fi' ? 'Normaali' : 'Normal')}
                          {item.selectedSize === 'perhe' && (language === 'fi' ? 'Perhe' : 'Family')}
                          {item.selectedSize === 'pannu' && (language === 'fi' ? 'Pannu' : 'Pan')}
                          {item.selectedSize === 'single' && ''}
                        </p>
                        <p className="text-amber-400 font-bold mt-1">
                          {item.selectedPrice.toFixed(2)}€
                        </p>
                        {item.notes && (
                          <p className="text-white/40 text-xs mt-1 italic">
                            {language === 'fi' ? 'Huom:' : 'Note:'} {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-neutral-700 rounded-lg p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1, item.selectedSize)
                          }
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="text-white font-bold px-3">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1, item.selectedSize)
                          }
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="bg-neutral-800 border-t border-amber-500/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-bold text-lg">
                  {language === 'fi' ? 'Yhteensä' : 'Total'}
                </span>
                <span className="text-amber-400 font-bold text-2xl">
                  {getTotalPrice().toFixed(2)}€
                </span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Navigate to checkout
                  window.location.hash = '#checkout';
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-lg transition-all transform hover:scale-105"
              >
                {language === 'fi' ? 'Siirry kassalle' : 'Proceed to Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
