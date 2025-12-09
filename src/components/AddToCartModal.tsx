import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import type { MenuItem } from '../data/menuData';
import type { CartItem } from './CartButton';

interface AddToCartModalProps {
  item: MenuItem;
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export function AddToCartModal({ item, language, theme, onClose, onAddToCart }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Initialize with first available size
  useState(() => {
    if (item.prices.norm) {
      setSelectedSize('Norm');
      setSelectedPrice(item.prices.norm);
    } else if (item.prices.perhe) {
      setSelectedSize('Perhe');
      setSelectedPrice(item.prices.perhe);
    } else if (item.prices.pannu) {
      setSelectedSize('Pannu');
      setSelectedPrice(item.prices.pannu);
    } else if (item.prices.single) {
      setSelectedSize('Single');
      setSelectedPrice(item.prices.single);
    }
  });

  const handleSizeChange = (size: string, price: number) => {
    setSelectedSize(size);
    setSelectedPrice(price);
  };

  const handleAddToCart = () => {
    if (!selectedPrice) {
      alert(language === 'fi' ? 'Valitse koko!' : 'Please select a size!');
      return;
    }

    const cartItem: CartItem = {
      ...item,
      cartItemId: `${item.id}-${selectedSize}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quantity,
      selectedSize,
      selectedPrice,
      notes: notes.trim() || undefined
    };

    onAddToCart(cartItem);
    onClose();
  };

  const totalPrice = selectedPrice * quantity;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      >
        {/* Modal */}
        <div
          className={`relative w-full rounded-xl shadow-2xl ${
            theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
          }`}
          style={{
            backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image */}
          <div className="relative overflow-hidden" style={{ height: '180px' }}>
            <img
              src={item.imageUrl || '/placeholder.jpg'}
              alt={language === 'fi' ? item.nameFi : item.nameEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Title & Description */}
            <div className="pb-3 border-b" style={{ borderColor: theme === 'light' ? '#e5e7eb' : '#374151' }}>
              <h2 className="text-2xl font-bold mb-2">
                {language === 'fi' ? item.nameFi : item.nameEn}
              </h2>
              <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {language === 'fi' ? item.ingredients : (item.ingredientsEn || item.ingredients)}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-base font-semibold mb-3">
                {language === 'fi' ? 'Valitse koko' : 'Select Size'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {item.prices.norm && (
                  <button
                    onClick={() => handleSizeChange('Norm', item.prices.norm!)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSize === 'Norm'
                        ? 'border-amber-500 bg-amber-500/10'
                        : theme === 'light'
                        ? 'border-gray-200 hover:border-amber-300'
                        : 'border-gray-600 hover:border-amber-600'
                    }`}
                  >
                    <div className="font-semibold mb-1">Norm</div>
                    <div className="text-amber-500 font-bold text-lg">€{item.prices.norm.toFixed(2)}</div>
                  </button>
                )}
                {item.prices.perhe && (
                  <button
                    onClick={() => handleSizeChange('Perhe', item.prices.perhe!)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSize === 'Perhe'
                        ? 'border-amber-500 bg-amber-500/10'
                        : theme === 'light'
                        ? 'border-gray-200 hover:border-amber-300'
                        : 'border-gray-600 hover:border-amber-600'
                    }`}
                  >
                    <div className="font-semibold mb-1">Perhe</div>
                    <div className="text-amber-500 font-bold text-lg">€{item.prices.perhe.toFixed(2)}</div>
                  </button>
                )}
                {item.prices.pannu && (
                  <button
                    onClick={() => handleSizeChange('Pannu', item.prices.pannu!)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSize === 'Pannu'
                        ? 'border-amber-500 bg-amber-500/10'
                        : theme === 'light'
                        ? 'border-gray-200 hover:border-amber-300'
                        : 'border-gray-600 hover:border-amber-600'
                    }`}
                  >
                    <div className="font-semibold mb-1">Pannu</div>
                    <div className="text-amber-500 font-bold text-lg">€{item.prices.pannu.toFixed(2)}</div>
                  </button>
                )}
                {item.prices.single && (
                  <button
                    onClick={() => handleSizeChange('Single', item.prices.single!)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSize === 'Single'
                        ? 'border-amber-500 bg-amber-500/10'
                        : theme === 'light'
                        ? 'border-gray-200 hover:border-amber-300'
                        : 'border-gray-600 hover:border-amber-600'
                    }`}
                  >
                    <div className="font-semibold mb-1">Single</div>
                    <div className="text-amber-500 font-bold text-lg">€{item.prices.single.toFixed(2)}</div>
                  </button>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-base font-semibold mb-3">
                {language === 'fi' ? 'Määrä' : 'Quantity'}
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`p-3 rounded-lg ${
                    theme === 'light'
                      ? 'bg-gray-100 hover:bg-gray-200'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={`p-3 rounded-lg ${
                    theme === 'light'
                      ? 'bg-gray-100 hover:bg-gray-200'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-base font-semibold mb-3">
                {language === 'fi' ? 'Erikoistoiveet (valinnainen)' : 'Special requests (optional)'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'fi' ? 'Esim. "Ilman sipulia"' : 'e.g. "No onions"'}
                className={`w-full p-4 rounded-lg border resize-none text-sm ${
                  theme === 'light'
                    ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                }`}
                rows={3}
              />
            </div>

            {/* Add to Cart Button */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: theme === 'light' ? '#e5e7eb' : '#374151' }}>
              <div>
                <div className={`text-xs mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {language === 'fi' ? 'Yhteensä' : 'Total'}
                </div>
                <div className="text-2xl font-bold text-amber-500">
                  €{totalPrice.toFixed(2)}
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {language === 'fi' ? 'Lisää koriin' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
