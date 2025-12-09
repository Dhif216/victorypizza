import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { menuData, MenuItem } from '../data/menuData';
import { AddToCartModal } from './AddToCartModal';
import type { CartItem } from './CartButton';

interface MenuGridProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  onAddToCart: (item: CartItem) => void;
}

type PriceKey = keyof MenuItem['prices'];

const categories = [
  { id: 'pizzas' as const, labelFi: 'Pizzat', labelEn: 'Pizzas', icon: '🍕' },
  { id: 'burgers' as const, labelFi: 'Burgerit', labelEn: 'Burgers', icon: '🍔' },
  { id: 'kebabs' as const, labelFi: 'Kebab', labelEn: 'Kebab', icon: '🥙' },
  { id: 'salads' as const, labelFi: 'Salaatit', labelEn: 'Salads', icon: '🥗' },
  { id: 'pasta' as const, labelFi: 'Pastat', labelEn: 'Pasta', icon: '🍝' },
  { id: 'drinks' as const, labelFi: 'Juomat', labelEn: 'Drinks', icon: '🥤' }
];

const priceLabels: Array<{ key: PriceKey; labelFi: string; labelEn: string }> = [
  { key: 'single', labelFi: 'Single', labelEn: 'Single' },
  { key: 'norm', labelFi: 'Norm', labelEn: 'Normal' },
  { key: 'perhe', labelFi: 'Perhe', labelEn: 'Family' },
  { key: 'pannu', labelFi: 'Pannu', labelEn: 'Pan' }
];

export function MenuGrid({ language, theme, onAddToCart }: MenuGridProps) {
  const [activeCategory, setActiveCategory] = useState<'pizzas' | 'burgers' | 'kebabs' | 'salads' | 'pasta' | 'drinks'>('pizzas');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const renderMenuItem = (item: MenuItem) => {
    const priceCells = priceLabels
      .map((label) => {
        const value = item.prices[label.key];
        if (value === undefined) return null;
        return {
          key: label.key,
          label: language === 'fi' ? label.labelFi : label.labelEn,
          value: `${value.toFixed(1)}€`
        };
      })
      .filter((entry): entry is { key: PriceKey; label: string; value: string } => entry !== null);

    return (
      <div key={item.id} className="menu-item-card">
        {item.imageUrl && (
          <div className="menu-item-image">
            <img
              src={item.imageUrl}
              alt={language === 'fi' ? item.nameFi : item.nameEn}
              loading="lazy"
            />
          </div>
        )}

        <div className="menu-item-content">
          <div className="menu-item-title">{language === 'fi' ? item.nameFi : item.nameEn}</div>
          <p className="menu-item-desc">
            {language === 'fi' ? item.ingredients : (item.ingredientsEn || item.ingredients)}
          </p>

          <div className="menu-item-prices">
            {priceCells.length > 0 ? (
              priceCells.map((price) => (
                <div key={price.key} className="price-tag">
                  <span className="price-label">{price.label}</span>
                  <span className="price-value">{price.value}</span>
                </div>
              ))
            ) : (
              <div className="price-tag">
                <span className="price-label">{language === 'fi' ? 'Kysy' : 'Ask'}</span>
                <span className="price-value">--</span>
              </div>
            )}
          </div>
        </div>

        <div className="menu-item-actions">
          <button
            type="button"
            className="add-btn"
            onClick={() => setSelectedItem(item)}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{language === 'fi' ? 'Tilaa' : 'Order'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <section id="menu" className="menu-section">
      <div className="menu-container">
        <div className="menu-header">
          <p className="hero-tagline">
            {language === 'fi' ? 'Valikoimamme' : 'Our selection'}
          </p>
          <h2 className="menu-title">{language === 'fi' ? 'Ruokalista' : 'Menu'}</h2>
        </div>

        <div className="menu-categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
            >
              <span aria-hidden>{cat.icon}</span> {language === 'fi' ? cat.labelFi : cat.labelEn}
            </button>
          ))}
        </div>

        <div className="menu-list">
          {menuData[activeCategory].map(renderMenuItem)}
        </div>
      </div>

      {selectedItem && (
        <AddToCartModal
          item={selectedItem}
          language={language}
          theme={theme}
          onClose={() => setSelectedItem(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
}
