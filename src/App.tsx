import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FoodGallery } from "./components/FoodGally";
import { MenuGrid } from "./components/MenuGrid";
import { Contact } from "./components/Contact";
import { CookieConsent } from "./components/CookieConsent";
import { CartButton, type CartItem } from "./components/CartButton";
import { CheckoutPage } from "./components/CheckoutPage";
import { OrderTracking } from "./components/OrderTracking";
import { RestaurantDashboard } from "./components/RestaurantDashboard";
import CartDrawer from "./components/Cart/CartDrawer";

export default function App() {
  const [language, setLanguage] = useState<"fi" | "en">("fi");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Apply theme to document
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  // useEffect(() => {
  //   // Handle hash-based routing
  //   const handleHashChange = () => {
  //     const hash = window.location.hash;
  //     const isCheckout = hash === '#checkout';
  //     console.log('Hash:', hash, 'Show checkout:', isCheckout);
  //     setShowCheckout(isCheckout);
  //   };

  //   // Only check hash if it exists, otherwise stay on main page
  //   if (window.location.hash) {
  //     handleHashChange();
  //   }
    
  //   window.addEventListener('hashchange', handleHashChange);
  //   return () => window.removeEventListener('hashchange', handleHashChange);
  // }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fi" ? "en" : "fi"));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleShowPrivacyPolicy = () => {
    console.log('handleShowPrivacyPolicy called - would set modal to true');
  };

  const handleClosePrivacyModal = () => {
    console.log('handleClosePrivacyModal called - would set modal to false');
  };

  // Cart functions
  const handleAddToCart = (newItem: CartItem) => {
    setCartItems(items => [...items, newItem]);
    alert(language === 'fi' ? '✅ Lisätty ostoskoriin!' : '✅ Added to cart!');
  };

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(items => items.filter(item => item.cartItemId !== cartItemId));
    } else {
      setCartItems(items =>
        items.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(items => items.filter(item => item.cartItemId !== cartItemId));
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout...', cartItems);
    setShowCheckout(true);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // console.log('App render - showCheckout:', showCheckout, 'hash:', window.location.hash);

  // Show restaurant dashboard
  if (showDashboard) {
    return (
      <RestaurantDashboard 
        language={language} 
        theme={theme} 
        onClose={() => setShowDashboard(false)}
      />
    );
  }

  // Show order tracking page
  if (showOrderTracking) {
    return (
      <div>
        <Header 
          language={language} 
          onToggleLanguage={toggleLanguage} 
          theme={theme} 
          onToggleTheme={toggleTheme}
          cartItemCount={cartItems.length}
          onCartClick={() => setShowCart(!showCart)}
          onTrackOrderClick={() => setShowOrderTracking(true)}
          onDashboardClick={() => setShowDashboard(true)}
        />
        <OrderTracking 
          language={language} 
          theme={theme} 
          onClose={() => setShowOrderTracking(false)}
        />
      </div>
    );
  }

  // Show checkout page
  if (showCheckout) {
    return (
      <CheckoutPage
        language={language}
        theme={theme}
        cartItems={cartItems}
        onBack={() => setShowCheckout(false)}
        onClearCart={handleClearCart}
        onTrackOrder={() => {
          setShowCheckout(false);
          setShowOrderTracking(true);
        }}
      />
    );
  }

  // Show main site
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "light" ? "bg-white" : "bg-black"
    }`}>
      <Header 
        language={language} 
        onToggleLanguage={toggleLanguage} 
        theme={theme} 
        onToggleTheme={toggleTheme}
        cartItemCount={cartItems.length}
        onCartClick={() => setShowCart(!showCart)}
        onTrackOrderClick={() => setShowOrderTracking(true)}
        onDashboardClick={() => setShowDashboard(true)}
      />
      <Hero language={language} theme={theme} />
      <FoodGallery language={language} theme={theme} />
      <MenuGrid language={language} theme={theme} onAddToCart={handleAddToCart} />
      <Contact language={language} theme={theme} onShowPolicy={handleShowPrivacyPolicy} />
      
      {/* Cookie Consent */}
      <CookieConsent 
        language={language}
        showPolicyModal={false}
        onClosePolicyModal={handleClosePrivacyModal}
      />
      
      {/* Shopping Cart */}
      {showCart && (
        <CartDrawer cartItems={cartItems} onClose={() => setShowCart(false)} />
      )}
      
        {/* Floating Call Button */}
        <a
          href="tel:00358-0468420302"
          className="fixed bottom-8 right-8 z-50 group"
          aria-label={language === "fi" ? "Soita nyt" : "Call now"}
        >
          <div className="relative">
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            
            {/* Main button */}
            <div className="relative flex items-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 rounded-full shadow-2xl shadow-green-500/50 transition-all transform group-hover:scale-110">
              <svg className="w-6 h-6 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
              <div className="hidden sm:block text-white font-bold">
                <div className="text-xs opacity-90">{language === "fi" ? "Tilaa nyt" : "Order now"}</div>
                <div className="text-sm">046 842 0302</div>
              </div>
            </div>
          </div>
        </a>

      {/* Shopping Cart */}
      <CartButton
        language={language}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        isOpen={showCart}
        onToggle={() => setShowCart(!showCart)}
      />

    </div>
  );
}