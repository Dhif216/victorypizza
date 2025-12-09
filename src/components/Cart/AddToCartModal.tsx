import { useState } from 'react';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../../data/menuData';

interface AddToCartModalProps {
  item: MenuItem;
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  onClose: () => void;
  onAddToCart: (size: 'norm' | 'perhe' | 'pannu' | 'single', price: number, quantity: number, notes: string) => void;
}

export function AddToCartModal({ item, language, theme, onClose, onAddToCart }: AddToCartModalProps) {
  const [selectedSize, setSelectedSize] = useState<'norm' | 'perhe' | 'pannu' | 'single'>(() => {
    if (item.prices.single !== undefined) return 'single';
    if (item.prices.norm !== undefined) return 'norm';
    if (item.prices.perhe !== undefined) return 'perhe';
    return 'pannu';
  });
  
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const getSizeLabel = (size: 'norm' | 'perhe' | 'pannu' | 'single') => {
    if (language === 'fi') {
      return {
        norm: 'Normaali',
        perhe: 'Perhe',
        pannu: 'Pannu',
        single: 'Yksittäinen'
      }[size];
    } else {
      return {
        norm: 'Normal',
        perhe: 'Family',
        pannu: 'Pan',
        single: 'Single'
      }[size];
    }
  };

  const availableSizes = Object.entries(item.prices)
    .filter(([_, price]) => price !== undefined)
    .map(([size, price]) => ({ size: size as 'norm' | 'perhe' | 'pannu' | 'single', price: price! }));

  const selectedPrice = item.prices[selectedSize] || 0;
  const totalPrice = selectedPrice * quantity;

  const handleAddToCart = () => {
    onAddToCart(selectedSize, selectedPrice, quantity, notes);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
          theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-neutral-900 to-neutral-950'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          {item.imageUrl && (
            <div className="w-full md:w-1/2 h-64 md:h-auto">
              <img 
                src={item.imageUrl} 
                alt={language === 'fi' ? item.nameFi : item.nameEn}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Details */}
          <div className="flex-1 p-6 md:p-8">
            <h3 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
              {language === 'fi' ? item.nameFi : item.nameEn}
            </h3>
            <p className={`text-sm mb-6 ${theme === 'light' ? 'text-black/60' : 'text-white/60'}`}>
              {language === 'fi' ? item.ingredients : (item.ingredientsEn || item.ingredients)}
            </p>

            {/* Size Selection */}
            {availableSizes.length > 1 && (
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-3 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                  {language === 'fi' ? 'Valitse koko:' : 'Select size:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableSizes.map(({ size, price }) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'border-amber-500 bg-amber-500/10'
                          : theme === 'light'
                            ? 'border-gray-300 hover:border-amber-500/50'
                            : 'border-neutral-700 hover:border-amber-500/50'
                      }`}
                    >
                      <div className={`text-sm font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                        {getSizeLabel(size)}
                      </div>
                      <div className="text-amber-500 font-bold">{price.toFixed(2)}€</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-3 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                {language === 'fi' ? 'Määrä:' : 'Quantity:'}
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className={`p-2 rounded-lg transition-colors ${
                    quantity <= 1
                      ? 'opacity-50 cursor-not-allowed'
                      : theme === 'light'
                        ? 'bg-gray-200 hover:bg-gray-300'
                        : 'bg-neutral-800 hover:bg-neutral-700'
                  }`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className={`text-xl font-bold w-12 text-center ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-200 hover:bg-gray-300'
                      : 'bg-neutral-800 hover:bg-neutral-700'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Special Notes */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                {language === 'fi' ? 'Erikoistoiveet (valinnainen):' : 'Special requests (optional):'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'fi' ? 'esim. "Ei sipulia"' : 'e.g. "No onions"'}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  theme === 'light'
                    ? 'bg-white border-gray-300 text-black focus:border-amber-500'
                    : 'bg-neutral-800 border-neutral-700 text-white focus:border-amber-500'
                } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                rows={3}
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-lg transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              {language === 'fi' ? 'Lisää ostoskoriin' : 'Add to Cart'} - {totalPrice.toFixed(2)}€
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
