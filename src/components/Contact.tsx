import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import logo from './file.svg';

interface ContactProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  onShowPolicy?: () => void;
}

export function Contact({ language, theme, onShowPolicy }: ContactProps) {
  return (
    <section id="contact" className={`relative py-32 border-t ${
      theme === "light"
        ? "bg-gradient-to-t from-gray-50 via-white to-gray-50 border-gray-200"
        : "bg-gradient-to-t from-neutral-950 via-neutral-900 to-black border-neutral-800"
    }`}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Left Column - Info */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-lg"></div>
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <img 
                      src={logo} 
                      alt="Victory Pizza Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h3 className={`text-3xl tracking-wider ${
                    theme === "light" ? "text-black" : "text-white"
                  }`} style={{ fontFamily: 'serif', letterSpacing: '0.1em' }}>VICTORY</h3>
                  <p className="text-amber-400 italic tracking-widest">PIZZA</p>
                </div>
              </div>
              <p className={`text-lg leading-relaxed ${
                theme === "light" ? "text-black/60" : "text-white/60"
              }`}>
                {language === 'fi' 
                  ? 'Tervetuloa nauttimaan aitoon italialaisen keittiön tunnelmaan Helsingin sydämessä. Tarjoamme vain parasta.'
                  : 'Welcome to enjoy the authentic Italian cuisine atmosphere in the heart of Helsinki. We serve only the best.'}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <a href="tel:00358-0468420302" className={`flex items-start gap-4 hover:text-amber-400 transition-colors group ${
                theme === "light" ? "text-black/80" : "text-white/80"
              }`}>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-full flex items-center justify-center border border-amber-500/30 group-hover:border-amber-500 transition-all flex-shrink-0">
                  <Phone className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex flex-col pt-1">
                  <div className={`text-xs uppercase mb-1 ${
                    theme === "light" ? "text-black/40" : "text-white/40"
                  }`}>{language === 'fi' ? 'Puhelin' : 'Phone'}</div>
                  <div>00358-046 842 0302</div>
                </div>
              </a>

              <a href="mailto:victroy.pizza.fi@gmail.com" className={`flex items-start gap-4 hover:text-amber-400 transition-colors group ${
                theme === "light" ? "text-black/80" : "text-white/80"
              }`}>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-full flex items-center justify-center border border-amber-500/30 group-hover:border-amber-500 transition-all flex-shrink-0">
                  <Mail className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex flex-col pt-1">
                  <div className={`text-xs uppercase mb-1 ${
                    theme === "light" ? "text-black/40" : "text-white/40"
                  }`}>Email</div>
                  <div className="break-all">victory.pizza.fi@gmail.com</div>
                </div>
              </a>

              <div className={`flex items-start gap-4 ${
                theme === "light" ? "text-black/80" : "text-white/80"
              }`}>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-full flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex flex-col pt-1">
                  <div className={`text-xs uppercase mb-1 ${
                    theme === "light" ? "text-black/40" : "text-white/40"
                  }`}>{language === 'fi' ? 'Osoite' : 'Address'}</div>
                  <div>Puustellinpolku 25, 00410 Helsinki</div>
                </div>
              </div>

              <div className={`flex items-start gap-4 ${
                theme === "light" ? "text-black/80" : "text-white/80"
              }`}>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-full flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex flex-col pt-1">
                  <div className={`text-xs uppercase mb-1 ${
                    theme === "light" ? "text-black/40" : "text-white/40"
                  }`}>{language === 'fi' ? 'Aukioloajat' : 'Opening Hours'}</div>
                  <div>{language === 'fi' ? 'Maanantai - Sunnuntai' : 'Monday - Sunday'}</div>
                  <div className="text-amber-400">11:00 - 22:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Map/Location */}
          <div>
            <div className={`rounded-2xl p-8 border h-full flex flex-col justify-center ${
              theme === "light"
                ? "bg-gradient-to-br from-gray-50 to-white border-gray-200"
                : "bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800"
            }`}>
              <h3 className={`text-2xl mb-6 ${
                theme === "light" ? "text-black" : "text-white"
              }`}>
                {language === 'fi' ? 'Vieraile Luonamme' : 'Visit Us'}
              </h3>
              <div className="aspect-video bg-neutral-800 rounded-xl mb-6 overflow-hidden relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1980.2299081438803!2d24.8641378!3d60.2431154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468df7477f161353%3A0x462865775e083c35!2sVictory%20pizza!5e0!3m2!1sen!2sfi!4v1764877075828!5m2!1sen!2sfi" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
              <p className={`mb-6 ${
                theme === "light" ? "text-black/60" : "text-white/60"
              }`}>
                {language === 'fi' 
                  ? 'Löydät meidät Helsingin Puustellinpolulta. Helppo saavutettavuus julkisilla kulkuneuvoilla.'
                  : 'Find us on Puustellinpolku in Helsinki. Easy access by public transport.'}
              </p>
              
              {/* Social Media */}
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-full flex items-center justify-center border border-amber-500/30 hover:border-amber-500 transition-all hover:scale-110">
                  <Facebook className="w-5 h-5 text-amber-500" />
                </a>
                <a href="#" className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-full flex items-center justify-center border border-amber-500/30 hover:border-amber-500 transition-all hover:scale-110">
                  <Instagram className="w-5 h-5 text-amber-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`pt-8 border-t text-center ${
          theme === "light" ? "border-gray-200" : "border-neutral-800"
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('Policy button clicked, onShowPolicy:', onShowPolicy);
                if (onShowPolicy) {
                  onShowPolicy();
                }
              }}
              className={`text-sm hover:text-amber-400 transition-colors underline ${
                theme === "light" ? "text-black/60" : "text-white/60"
              }`}
            >
              {language === 'fi' ? 'Tietosuojakäytäntö' : 'Privacy Policy'}
            </button>
            <span className={theme === "light" ? "text-black/40" : "text-white/40"}>•</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('Cookie button clicked, onShowPolicy:', onShowPolicy);
                if (onShowPolicy) {
                  onShowPolicy();
                }
              }}
              className={`text-sm hover:text-amber-400 transition-colors underline ${
                theme === "light" ? "text-black/60" : "text-white/60"
              }`}
            >
              {language === 'fi' ? 'Evästekäytäntö' : 'Cookie Policy'}
            </button>
          </div>
          <p className={`text-sm ${
            theme === "light" ? "text-black/40" : "text-white/40"
          }`}>
            © 2024 Victory Pizza. {language === 'fi' ? 'Kaikki oikeudet pidätetään.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </section>
  );
}
