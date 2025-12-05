import { Phone, Clock, Sun, Moon, ShoppingCart, Package, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-lg group-hover:bg-amber-500/50 transition-all"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="Victory Pizza Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl tracking-wider text-gray-900" style={{ fontFamily: 'serif', letterSpacing: '0.1em' }}>VICTORY</h1>
              <p className="text-xs text-amber-500 italic tracking-widest">PIZZA</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#gallery" className="hover:text-amber-500 transition-colors text-sm tracking-wide uppercase text-gray-700">
              {language === 'fi' ? 'Galleria' : 'Gallery'}
            </a>
            <a href="#menu" className="hover:text-amber-500 transition-colors text-sm tracking-wide uppercase text-gray-700">
              Menu
            </a>
            <a href="#contact" className="hover:text-amber-500 transition-colors text-sm tracking-wide uppercase text-gray-700">
              {language === 'fi' ? 'Yhteystiedot' : 'Contact'}
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Contact Info - Hidden on mobile */}
            <div className="hidden xl:flex items-center gap-6 text-sm mr-4">
              <div className="flex items-center gap-2 hover:text-amber-500 transition-colors cursor-pointer text-gray-700">
                <Phone className="w-4 h-4" />
                <span>046 842 0302</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4" />
                <span>11:00 - 22:00</span>
              </div>
            </div>
            
            {/* Track Order Button */}
            <button
              onClick={onTrackOrderClick}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all transform hover:scale-105 shadow-md"
              aria-label={language === 'fi' ? 'Seuraa tilausta' : 'Track order'}
              title={language === 'fi' ? 'Seuraa tilausta' : 'Track order'}
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dashboard Button */}
            <button
              onClick={onDashboardClick}
              className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-all transform hover:scale-105 shadow-md"
              aria-label={language === 'fi' ? 'Ravintolan hallinta' : 'Restaurant Dashboard'}
              title={language === 'fi' ? 'Ravintolan hallinta' : 'Restaurant Dashboard'}
            >
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-all transform hover:scale-105 shadow-md"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartItemCount}
                </div>
              )}
            </button>
            
            {/* Theme Toggle - Hidden on smallest screens */}
            <button
              onClick={onToggleTheme}
              className="hidden sm:block p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all transform hover:scale-105 shadow-md"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full transition-all transform hover:scale-105 text-xs sm:text-sm uppercase tracking-wider shadow-md font-semibold"
            >
              {language === 'fi' ? 'EN' : 'FI'}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <nav className="flex flex-col gap-4">
              <a 
                href="#gallery" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-amber-500 transition-colors text-sm tracking-wide uppercase py-2"
              >
                {language === 'fi' ? 'Galleria' : 'Gallery'}
              </a>
              <a 
                href="#menu" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-amber-500 transition-colors text-sm tracking-wide uppercase py-2"
              >
                Menu
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-amber-500 transition-colors text-sm tracking-wide uppercase py-2"
              >
                {language === 'fi' ? 'Yhteystiedot' : 'Contact'}
              </a>
              
              {/* Mobile Contact Info */}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>046 842 0302</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>11:00 - 22:00</span>
                </div>
              </div>

              {/* Theme Toggle for Mobile */}
              <button
                onClick={() => {
                  onToggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="sm:hidden w-full p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>{language === 'fi' ? 'Tumma teema' : 'Dark Theme'}</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>{language === 'fi' ? 'Valoisa teema' : 'Light Theme'}</span>
                  </>
                )}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
