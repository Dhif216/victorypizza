import { Phone, ShoppingBag, Clock } from 'lucide-react';
import heroPizza from './pizza.png';

interface HeroProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
}

export function Hero({ language }: HeroProps) {
  return (
    <section className="victory-hero-modern">
      <div className="hero-content-modern">
        <div className="hero-text-side">
          <div className="location-badge">
            <div className="location-dot" />
            <span>Helsinki, Finland</span>
          </div>

          <h1 className="hero-title-main">
            <span className="title-victory">Victory Pizza</span>
            <span className="title-pizza">Crafted fresh. Delivered fast.</span>
          </h1>

          <p className="hero-tagline">
            {language === 'fi'
              ? 'Puhdas maku, tuoreet raaka-aineet ja luotettava toimitus.'
              : 'Clean flavors, fresh ingredients, and delivery you can trust.'}
          </p>

          <div className="hero-meta">
            <div className="meta-card">
              <div className="meta-icon">
                <Phone size={18} />
              </div>
              <div>
                <div className="meta-label">{language === 'fi' ? 'Tilaa puhelimitse' : 'Call to order'}</div>
                <div className="meta-value">046 842 0302</div>
              </div>
            </div>
            <div className="meta-card">
              <div className="meta-icon">
                <Clock size={18} />
              </div>
              <div>
                <div className="meta-label">{language === 'fi' ? 'Avoinna tänään' : 'Open today'}</div>
                <div className="meta-value">09:00 - 23:00</div>
              </div>
            </div>
          </div>

          <div className="hero-cta-group">
            <a href="tel:00358-0468420302" className="cta-button cta-primary">
              <Phone className="cta-icon" />
              <span>{language === 'fi' ? 'Soita ja tilaa' : 'Call to order'}</span>
            </a>
            <a href="#menu" className="cta-button cta-secondary">
              <ShoppingBag className="cta-icon" />
              <span>{language === 'fi' ? 'Katso menu' : 'View menu'}</span>
            </a>
          </div>

          <div className="hero-metrics">
            <div>
              <strong>4.8★</strong>
              <span>{language === 'fi' ? 'Asiakasarviot' : 'Customer rating'}</span>
            </div>
            <div>
              <strong>30 min</strong>
              <span>{language === 'fi' ? 'Keskimääräinen toimitus' : 'Avg delivery'}</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>{language === 'fi' ? 'Tuoreet raaka-aineet' : 'Fresh ingredients'}</span>
            </div>
          </div>
        </div>

        <div className="hero-image-side">
          <img
            src={heroPizza}
            alt={language === 'fi' ? 'Tuore pizza' : 'Fresh pizza'}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
