import { ChevronDown } from 'lucide-react';

interface HeroProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
}

export function Hero({ language, theme }: HeroProps) {
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-28 ${
      theme === "light" ? "bg-gradient-to-b from-gray-50 via-white to-gray-50" : ""
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${
          theme === "light" 
            ? "bg-gradient-to-b from-gray-50 via-white to-gray-50" 
            : "bg-gradient-to-b from-black via-neutral-900 to-black"
        }`}></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid Pattern */}
        <div className={`absolute inset-0 ${theme === "light" ? "opacity-10" : "opacity-5"}`} 
          style={{
            backgroundImage: 'linear-gradient(rgba(217, 119, 6, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 119, 6, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}>
        </div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Main Title */}
        <div className="mb-12">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-400 text-sm tracking-[0.3em] uppercase">
                {language === 'fi' ? 'Helsinki' : 'Helsinki'}
              </span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h1 className={`text-7xl md:text-8xl lg:text-9xl mb-6 tracking-tight ${
              theme === "light" ? "text-black" : "text-white"
            }`} 
              style={{ 
                fontFamily: 'serif',
                textShadow: theme === "light" 
                  ? '0 0 40px rgba(251, 191, 36, 0.2)' 
                  : '0 0 40px rgba(251, 191, 36, 0.3)'
              }}>
              VICTORY
            </h1>
            <p className="text-3xl md:text-4xl text-amber-400 italic mb-6">Pizza</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className={`text-xl md:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed ${
          theme === "light" ? "text-black/70" : "text-white/70"
        }`}>
          {language === 'fi' 
            ? 'Koe ylellisyys jokaisessa palassa - Autenttista pizzaa ja gourmet-ruokaa sydämessä Helsinkiä' 
            : 'Experience luxury in every bite - Authentic pizza and gourmet food in the heart of Helsinki'}
        </p>

        {/* Eye-catching CTA for Call/Order */}
        <div className="mb-12">
          <a 
            href="tel:00358-0468420302" 
            className="group relative inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 text-lg font-bold uppercase tracking-wider animate-pulse hover:animate-none"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <span className="relative text-2xl">📞</span>
            <div className="relative text-left">
              <div className="text-xs opacity-80 font-normal">
                {language === 'fi' ? 'Soita ja tilaa nyt' : 'Call & Order Now'}
              </div>
              <div className="text-xl font-bold">046 842 0302</div>
            </div>
            <svg className="relative w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <a 
            href="#menu" 
            className="group px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-amber-500/20 text-sm uppercase tracking-widest inline-flex items-center gap-2"
          >
            {language === 'fi' ? 'Tutustu Menuun' : 'Explore Menu'}
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </a>
          <a 
            href="tel:00358-0468420302" 
            className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/20 hover:border-amber-500/50 text-sm uppercase tracking-widest backdrop-blur-sm"
          >
            {language === 'fi' ? 'Varaa Pöytä' : 'Reserve Table'}
          </a>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/50 transition-all">
            <div className="text-3xl mb-2">🍕</div>
            <h3 className="text-white text-lg mb-1 tracking-wide">
              {language === 'fi' ? 'Tuoreita Aineksia' : 'Fresh Ingredients'}
            </h3>
            <p className="text-white/50 text-sm">
              {language === 'fi' ? 'Vain parhaista raaka-aineista' : 'Only the finest ingredients'}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/50 transition-all">
            <div className="text-3xl mb-2">👨‍🍳</div>
            <h3 className="text-white text-lg mb-1 tracking-wide">
              {language === 'fi' ? 'Taitavat Kokit' : 'Expert Chefs'}
            </h3>
            <p className="text-white/50 text-sm">
              {language === 'fi' ? 'Perinteiset reseptit' : 'Traditional recipes'}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/50 transition-all">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-white text-lg mb-1 tracking-wide">
              {language === 'fi' ? 'Nopea Palvelu' : 'Fast Service'}
            </h3>
            <p className="text-white/50 text-sm">
              {language === 'fi' ? 'Tuore ja kuuma' : 'Fresh and hot'}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-amber-500" />
      </div>
    </section>
  );
}
