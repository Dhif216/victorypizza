import { Phone, Clock, Sun, Moon, ShoppingCart, Package, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from './file.svg';

interface HeaderProps {
  language: 'fi' | 'en';
  onToggleLanguage: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  onTrackOrderClick?: () => void;
  onDashboardClick?: () => void;
}

export function Header({ language, onToggleLanguage, theme, onToggleTheme, cartItemCount = 0, onCartClick, onTrackOrderClick, onDashboardClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? theme === "light" 
          ? 'bg-white/95 backdrop-blur-xl py-4 shadow-2xl border-b border-amber-500/20' 
          : 'bg-black/95 backdrop-blur-xl py-4 shadow-2xl border-b border-amber-500/20'
        : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-lg group-hover:bg-amber-500/50 transition-all"></div>
              <div className="relative w-12 h-12 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="Victory Pizza Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <h1 className={`text-2xl tracking-wider ${theme === "light" ? "text-black" : "text-white"}`} style={{ fontFamily: 'serif', letterSpacing: '0.1em' }}>VICTORY</h1>
              <p className="text-xs text-amber-400 italic tracking-widest">PIZZA</p>
            </div>
          </a>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#gallery" className={`hover:text-amber-400 transition-colors text-sm tracking-wide uppercase ${
              theme === "light" ? "text-black/80" : "text-white/80"
            }`}>
              {language === 'fi' ? 'Galleria' : 'Gallery'}
            </a>
            <a href="#menu" className={`hover:text-amber-400 transition-colors text-sm tracking-wide uppercase ${
              theme === "light" ? "text-black/80" : "text-white/80"
            }`}>
              Menu
            </a>
            <a href="#contact" className={`hover:text-amber-400 transition-colors text-sm tracking-wide uppercase ${
              theme === "light" ? "text-black/80" : "text-white/80"
            }`}>
              {language === 'fi' ? 'Yhteystiedot' : 'Contact'}
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className={`flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer ${
                theme === "light" ? "text-black/70" : "text-white/70"
              }`}>
                <Phone className="w-4 h-4" />
                <span>046 842 0302</span>
              </div>
              <div className={`flex items-center gap-2 ${
                theme === "light" ? "text-black/70" : "text-white/70"
              }`}>
                <Clock className="w-4 h-4" />
                <span>11:00 - 22:00</span>
              </div>
            </div>
            
            {/* Track Order Button */}
            <button
              onClick={onTrackOrderClick}
              className={`relative p-2 rounded-full transition-all transform hover:scale-105 ${
                theme === "light" 
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              aria-label={language === 'fi' ? 'Seuraa tilausta' : 'Track order'}
              title={language === 'fi' ? 'Seuraa tilausta' : 'Track order'}
            >
              <Package className="w-5 h-5" />
            </button>

            {/* Dashboard Button */}
            <button
              onClick={onDashboardClick}
              className={`relative p-2 rounded-full transition-all transform hover:scale-105 ${
                theme === "light" 
                  ? "bg-purple-500 hover:bg-purple-600 text-white" 
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
              aria-label={language === 'fi' ? 'Ravintolan hallinta' : 'Restaurant Dashboard'}
              title={language === 'fi' ? 'Ravintolan hallinta' : 'Restaurant Dashboard'}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className={`relative p-2 rounded-full transition-all transform hover:scale-105 ${
                theme === "light" 
                  ? "bg-amber-500 hover:bg-amber-600 text-white" 
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartItemCount}
                </div>
              )}
            </button>
            
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full transition-all transform hover:scale-105 ${
                theme === "light" 
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-800" 
                  : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <button
              onClick={onToggleLanguage}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black rounded-full transition-all transform hover:scale-105 text-sm uppercase tracking-wider"
            >
              {language === 'fi' ? 'EN' : 'FI'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
