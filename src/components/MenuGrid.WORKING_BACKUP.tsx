import { useState } from 'react';
// import { ShoppingCart } from 'lucide-react';
import { menuData, MenuItem } from '../data/menuData';
// import { useCart } from '../context/CartContext';
// import { AddToCartModal } from './Cart/AddToCartModal';

interface MenuGridProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
}

export function MenuGrid({ language, theme }: MenuGridProps) {
  const [activeCategory, setActiveCategory] = useState<'pizzas' | 'burgers' | 'kebabs' | 'salads' | 'drinks'>('pizzas');
  // const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  // const { addToCart } = useCart();

  // const handleAddToCart = (item: MenuItem, size: 'norm' | 'perhe' | 'pannu' | 'single', _price: number, quantity: number, notes: string) => {
  //   // Add items based on quantity
  //   for (let i = 0; i < quantity; i++) {
  //     addToCart(item, size, notes);
  //   }
  // };

  const categories = [
    { 
      id: 'pizzas' as const, 
      labelFi: 'Pizzat', 
      labelEn: 'Pizzas',
      icon: '🍕'
    },
    { 
      id: 'burgers' as const, 
      labelFi: 'Burgerit', 
      labelEn: 'Burgers',
      icon: '🍔'
    },
    { 
      id: 'kebabs' as const, 
      labelFi: 'Kebab', 
      labelEn: 'Kebab',
      icon: '🥙'
    },
    { 
      id: 'salads' as const, 
      labelFi: 'Salaatit', 
      labelEn: 'Salads',
      icon: '🥗'
    },
    { 
      id: 'drinks' as const, 
      labelFi: 'Juomat', 
      labelEn: 'Drinks',
      icon: '🥤'
    }
  ];

  const renderMenuItem = (item: MenuItem) => (
    <div 
      key={item.id}
      className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl ${
        theme === "light"
          ? "bg-white border-gray-200 hover:border-amber-500/50 hover:shadow-amber-500/10"
          : "bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800 hover:border-amber-500/50 hover:shadow-amber-500/10"
      }`}
    >
      <div className="flex gap-4">
        {/* Image on the left */}
        {item.imageUrl && (
          <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            <img 
              src={item.imageUrl} 
              alt={language === 'fi' ? item.nameFi : item.nameEn}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Content on the right */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-amber-500 text-sm opacity-50">#{item.id}</span>
              <h3 className={`text-xl group-hover:text-amber-400 transition-colors ${
                theme === "light" ? "text-black" : "text-white"
              }`}>
                {language === 'fi' ? item.nameFi : item.nameEn}
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${
              theme === "light" ? "text-black/40" : "text-white/40"
            }`}>
              {language === 'fi' ? item.ingredients : (item.ingredientsEn || item.ingredients)}
            </p>
          </div>

          {/* Pricing */}
          <div className={`flex justify-end items-center gap-6 pt-4 mt-4 border-t ${
            theme === "light" ? "border-gray-200" : "border-neutral-800"
          }`}>
            {/* Order button temporarily disabled */}
            {/* <button
              onClick={() => setSelectedItem(item)}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {language === 'fi' ? 'Tilaa' : 'Order'}
            </button> */}
            
            {/* <div className="flex items-center gap-6"> */}
              {item.prices.single !== undefined && (
                <div className="text-right">
                  <div className="text-2xl text-amber-500">{item.prices.single.toFixed(1)}€</div>
                </div>
              )}
              
              {item.prices.norm !== undefined && (
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className={`text-xs uppercase mb-1 ${
                      theme === "light" ? "text-black/30" : "text-white/30"
                    }`}>
                      {language === 'fi' ? 'Norm' : 'Normal'}
                    </div>
                    <div className="text-lg text-amber-500">{item.prices.norm.toFixed(1)}€</div>
                  </div>
                  {item.prices.perhe !== undefined && (
                    <div className="text-center">
                      <div className={`text-xs uppercase mb-1 ${
                        theme === "light" ? "text-black/30" : "text-white/30"
                      }`}>
                        {language === 'fi' ? 'Perhe' : 'Family'}
                      </div>
                      <div className="text-lg text-amber-500">{item.prices.perhe.toFixed(1)}€</div>
                    </div>
                  )}
                  {item.prices.pannu !== undefined && (
                    <div className="text-center">
                      <div className={`text-xs uppercase mb-1 ${
                        theme === "light" ? "text-black/30" : "text-white/30"
                      }`}>
                        {language === 'fi' ? 'Pannu' : 'Pan'}
                      </div>
                      <div className="text-lg text-amber-500">{item.prices.pannu.toFixed(1)}€</div>
                    </div>
                  )}
                </div>
              )}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="menu" className={`relative py-32 ${
      theme === "light" ? "bg-gray-50" : "bg-black"
    }`}>
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-amber-400 text-sm tracking-[0.3em] uppercase">
              {language === 'fi' ? 'Valikoimamme' : 'Our Selection'}
            </span>
          </div>
          <h2 className={`text-5xl md:text-6xl mb-4 tracking-tight ${
            theme === "light" ? "text-black" : "text-white"
          }`} style={{ fontFamily: 'serif' }}>
            {language === 'fi' ? 'Ruokalista' : 'Menu'}
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-8 py-4 rounded-full transition-all text-sm uppercase tracking-wider ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-2xl shadow-amber-500/30'
                  : theme === "light"
                    ? 'bg-white text-black/60 hover:text-black border border-gray-300 hover:border-amber-500/50'
                    : 'bg-neutral-900 text-white/60 hover:text-white border border-neutral-800 hover:border-amber-500/50'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {language === 'fi' ? cat.labelFi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {menuData[activeCategory].map(renderMenuItem)}
        </div>
      </div>

      {/* Add to Cart Modal - Temporarily disabled */}
      {/* {selectedItem && (
        <AddToCartModal
          item={selectedItem}
          language={language}
          theme={theme}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(size, price, quantity, notes) => {
            handleAddToCart(selectedItem, size, price, quantity, notes);
          }}
        />
      )} */}
    </section>
  );
}
