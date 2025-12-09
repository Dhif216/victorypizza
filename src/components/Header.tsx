import { useState } from 'react';
import { Sun, Moon, ShoppingCart, UtensilsCrossed, LayoutDashboard, Menu, X } from 'lucide-react';
import '../styles/app.css';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="victory-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="#" className="navbar-logo">
          <div className="logo-text">
            <h1>VICTORY</h1>
            <p>PIZZA</p>
          </div>
        </a>

        {/* Mobile Toggle */}
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="navbar-nav hidden-tablet">
          <a href="#gallery" className="nav-link">
            {language === 'fi' ? 'Galleria' : 'Gallery'}
          </a>
          <a href="#menu" className="nav-link">
            Menu
          </a>
          <a href="#contact" className="nav-link">
            {language === 'fi' ? 'Yhteystiedot' : 'Contact'}
          </a>
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Track Order */}
          <button
            onClick={onTrackOrderClick}
            className="icon-button blue"
            title={language === 'fi' ? 'Seuraa tilausta' : 'Track order'}
          >
            <UtensilsCrossed />
          </button>

          {/* Dashboard */}
          <button
            onClick={onDashboardClick}
            className="icon-button purple"
            title={language === 'fi' ? 'Ravintolan hallinta' : 'Restaurant Dashboard'}
          >
            <LayoutDashboard />
          </button>
          
          {/* Cart */}
          <button onClick={onCartClick} className="icon-button orange">
            <ShoppingCart />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
          
          {/* Theme Toggle */}
          <button onClick={onToggleTheme} className="icon-button gray">
            {theme === "light" ? <Moon /> : <Sun />}
          </button>
          
          {/* Language */}
          <button onClick={onToggleLanguage} className="language-button">
            {language === 'fi' ? 'EN' : 'FI'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <a href="#gallery" className="nav-link" onClick={closeMobileMenu}>
          {language === 'fi' ? 'Galleria' : 'Gallery'}
        </a>
        <a href="#menu" className="nav-link" onClick={closeMobileMenu}>
          Menu
        </a>
        <a href="#contact" className="nav-link" onClick={closeMobileMenu}>
          {language === 'fi' ? 'Yhteystiedot' : 'Contact'}
        </a>
        <div className="mobile-actions">
          <button
            onClick={() => { onTrackOrderClick?.(); closeMobileMenu(); }}
            className="icon-button blue"
          >
            <UtensilsCrossed />
            <span>{language === 'fi' ? 'Seuraa' : 'Track'}</span>
          </button>
          <button
            onClick={() => { onDashboardClick?.(); closeMobileMenu(); }}
            className="icon-button purple"
          >
            <LayoutDashboard />
            <span>{language === 'fi' ? 'Hallinta' : 'Dashboard'}</span>
          </button>
          <button
            onClick={() => { onCartClick?.(); closeMobileMenu(); }}
            className="icon-button orange"
          >
            <ShoppingCart />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            <span>{language === 'fi' ? 'Ostoskori' : 'Cart'}</span>
          </button>
          <button onClick={() => { onToggleTheme(); closeMobileMenu(); }} className="icon-button gray">
            {theme === 'light' ? <Moon /> : <Sun />}
            <span>{language === 'fi' ? 'Teema' : 'Theme'}</span>
          </button>
          <button onClick={() => { onToggleLanguage(); closeMobileMenu(); }} className="language-button">
            {language === 'fi' ? 'EN' : 'FI'}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && <div className="mobile-nav-overlay" onClick={closeMobileMenu} aria-hidden="true" />}
    </header>
  );
}
