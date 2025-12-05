import { Phone, Clock, Sun, Moon, ShoppingCart, Package, LayoutDashboard } from 'lucide-react';
import logo from './file.svg';
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
  return (
    <header className="victory-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="#" className="navbar-logo">
          <img src={logo} alt="Victory Pizza Logo" className="logo-image" />
          <div className="logo-text">
            <h1>VICTORY</h1>
            <p>PIZZA</p>
          </div>
        </a>

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
          {/* Contact Info - Hidden on smaller screens */}
          <div className="contact-info hidden-mobile">
            <Phone />
            <span>046 842 0302</span>
          </div>
          <div className="contact-info hidden-mobile">
            <Clock />
            <span>11:00 - 22:00</span>
          </div>
          
          {/* Track Order */}
          <button
            onClick={onTrackOrderClick}
            className="icon-button blue"
            title={language === 'fi' ? 'Seuraa tilausta' : 'Track order'}
          >
            <Package />
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
          <button onClick={onCartClick} className="icon-button amber">
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
    </header>
  );
}
