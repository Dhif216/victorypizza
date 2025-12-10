import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

interface ContactProps {
  language: 'fi' | 'en';
  theme: 'dark' | 'light';
  onShowPolicy?: () => void;
}

export function Contact({ language, onShowPolicy }: ContactProps) {
  return (
    <section id="contact" className="relative py-32 border-t bg-white border-gray-200">

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Left Column - Info */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h3 className="text-3xl tracking-wider text-gray-900" style={{ fontFamily: 'serif', letterSpacing: '0.1em' }}>VICTORY</h3>
                  <p className="italic tracking-widest text-gray-600">PIZZA</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-gray-600">
                {language === 'fi' 
                  ? 'Tervetuloa nauttimaan aitoon italialaisen keittiön tunnelmaan Helsingin sydämessä. Tarjoamme vain parasta.'
                  : 'Welcome to enjoy the authentic Italian cuisine atmosphere in the heart of Helsinki. We serve only the best.'}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <a href="tel:00358-0468420302" className="flex items-start gap-4 transition-colors group text-gray-900 hover:text-green-600">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center border border-green-500/30 group-hover:border-green-500 transition-all flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex flex-col pt-1">
                  <div className="text-xs uppercase mb-1 text-gray-500">{language === 'fi' ? 'Puhelin' : 'Phone'}</div>
                  <div>00358-046 842 0302</div>
                </div>
              </a>

              <a href="mailto:victroy.pizza.fi@gmail.com" className="flex items-start gap-4 transition-colors group text-gray-900 hover:text-green-600">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center border border-green-500/30 group-hover:border-green-500 transition-all flex-shrink-0">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex flex-col pt-1">
                  <div className="text-xs uppercase mb-1 text-gray-500">Email</div>
                  <div className="break-all">victory.pizza.fi@gmail.com</div>
                </div>
              </a>

              <div className="flex items-start gap-4 text-gray-900">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center border border-green-500/30 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex flex-col pt-1">
                  <div className="text-xs uppercase mb-1 text-gray-500">{language === 'fi' ? 'Osoite' : 'Address'}</div>
                  <div>Puustellinpolku 25, 00410 Helsinki</div>
                </div>
              </div>

              <div className="flex items-start gap-4 text-gray-900">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center border border-green-500/30 flex-shrink-0">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex flex-col pt-1">
                  <div className="text-xs uppercase mb-1 text-gray-500">{language === 'fi' ? 'Aukioloajat' : 'Opening Hours'}</div>
                  <div>{language === 'fi' ? 'Maanantai - Sunnuntai' : 'Monday - Sunday'}</div>
                  <div className="text-green-600 font-bold">09:00 - 23:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Map/Location */}
          <div>
            {/* Map Container - Only map inside */}
            <div className="rounded-2xl p-6 border mb-4 bg-gray-50 border-gray-200">
              <h3 className="text-2xl mb-4 text-gray-900">
                {language === 'fi' ? 'Vieraile Luonamme' : 'Visit Us'}
              </h3>
              
              {/* Map Container */}
              <div className="bg-neutral-900 rounded-xl overflow-hidden relative border-2 border-green-500" style={{ height: '280px' }}>
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
            </div>

            {/* Text Below Map Container */}
            <p className="text-sm mb-4 text-gray-600">
              {language === 'fi' 
                ? 'Löydät meidät Helsingin Puustellinpolulta. Helppo saavutettavuus julkisilla kulkuneuvoilla.'
                : 'Find us on Puustellinpolku in Helsinki. Easy access by public transport.'}
            </p>
            
            {/* Social Media - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex gap-4">
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center border border-green-500/30 hover:border-green-500 transition-all hover:scale-110">
                <Facebook className="w-5 h-5 text-green-600" />
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center border border-green-500/30 hover:border-green-500 transition-all hover:scale-110">
                <Instagram className="w-5 h-5 text-green-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t text-center border-gray-200">
          {/* Social Media Icons - Shown on mobile only */}
          <div className="flex md:hidden gap-4 justify-center mb-6">
            <a href="#" className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center border-2 border-green-500/50 hover:border-green-500 transition-all hover:scale-110">
              <Facebook className="w-6 h-6 text-green-600" />
            </a>
            <a href="#" className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center border-2 border-green-500/50 hover:border-green-500 transition-all hover:scale-110">
              <Instagram className="w-6 h-6 text-green-600" />
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('Policy button clicked, onShowPolicy:', onShowPolicy);
                if (onShowPolicy) {
                  onShowPolicy();
                }
              }}
              className="text-sm transition-colors underline text-gray-600 hover:text-green-600"
            >
              {language === 'fi' ? 'Tietosuojakäytäntö' : 'Privacy Policy'}
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('Cookie button clicked, onShowPolicy:', onShowPolicy);
                if (onShowPolicy) {
                  onShowPolicy();
                }
              }}
              className="text-sm transition-colors underline text-gray-600 hover:text-green-600"
            >
              {language === 'fi' ? 'Evästekäytäntö' : 'Cookie Policy'}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 Victory Pizza. {language === 'fi' ? 'Kaikki oikeudet pidätetään.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </section>
  );
}
