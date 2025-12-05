import { ChevronDown, Phone, ShoppingBag, Clock, Star } from 'lucide-react';

interface HeroProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
}

export function Hero({ language }: HeroProps) {
  return (
    <section className="victory-hero-modern">
      {/* Clean Background with Patterns */}
      <div className="hero-bg-modern">
        <div className="hero-pattern-dots"></div>
        <div className="hero-pattern-circles"></div>
      </div>

      <div className="hero-content-modern">
        {/* Location Badge */}
        <div className="location-badge">
          <div className="location-dot"></div>
          <span>Helsinki, Finland</span>
        </div>

        {/* Main Title - Bold & Clean */}
        <h1 className="hero-title-main">
          <span className="title-victory">VICTORY</span>
          <span className="title-pizza">PIZZA</span>
        </h1>

        {/* Tagline */}
        <p className="hero-tagline">
          {language === 'fi' 
            ? 'Autenttista Pizzaa • Tuoreita Aineksia • Nopea Toimitus' 
            : 'Authentic Pizza • Fresh Ingredients • Fast Delivery'}
        </p>

        {/* CTA Buttons - Side by Side */}
        <div className="hero-cta-group">
          <a href="tel:00358-0468420302" className="cta-button cta-primary">
            <Phone className="cta-icon" />
            <div className="cta-text">
              <span className="cta-label">{language === 'fi' ? 'Tilaa Nyt' : 'Order Now'}</span>
              <span className="cta-number">046 842 0302</span>
            </div>
          </a>
          
          <a href="#menu" className="cta-button cta-secondary">
            <ShoppingBag className="cta-icon" />
            <div className="cta-text">
              <span className="cta-label">{language === 'fi' ? 'Tutustu Menuun' : 'View Menu'}</span>
              <span className="cta-subtitle">{language === 'fi' ? '50+ Vaihtoehtoa' : '50+ Options'}</span>
            </div>
          </a>
        </div>

        {/* Feature Cards - Horizontal */}
        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon feature-icon-orange">
              <Star />
            </div>
            <div className="feature-content">
              <h3>{language === 'fi' ? 'Palkittu Resepti' : 'Award Recipe'}</h3>
              <p>{language === 'fi' ? 'Perinteinen italia' : 'Traditional Italian'}</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon feature-icon-green">
              <Clock />
            </div>
            <div className="feature-content">
              <h3>{language === 'fi' ? '30 Min Toimitus' : '30 Min Delivery'}</h3>
              <p>{language === 'fi' ? 'Tuore ja kuuma' : 'Fresh & Hot'}</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon feature-icon-red">
              <ShoppingBag />
            </div>
            <div className="feature-content">
              <h3>{language === 'fi' ? 'Tuoreet Aineet' : 'Fresh Ingredients'}</h3>
              <p>{language === 'fi' ? 'Päivittäin tuoretta' : 'Daily fresh'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <ChevronDown />
      </div>
    </section>
  );
}
