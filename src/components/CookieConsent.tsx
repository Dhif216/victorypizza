import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CookieConsentProps {
  language: 'fi' | 'en';
  showPolicyModal?: boolean;
  onClosePolicyModal?: () => void;
}

export function CookieConsent({ language, showPolicyModal = false, onClosePolicyModal }: CookieConsentProps) {
  const [showConsent, setShowConsent] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setShowConsent(true), 1000);
    }
  }, []);

  useEffect(() => {
    setShowModal(showPolicyModal);
  }, [showPolicyModal]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
    }
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  const closeModal = () => {
    setShowModal(false);
    if (onClosePolicyModal) {
      onClosePolicyModal();
    }
  };

  return (
    <>
      {/* Cookie Banner */}
      {showConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-xl border-t border-amber-500/20">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-white/80 text-sm">
                  {language === 'fi' 
                    ? '🍪 Käytämme evästeitä parantaaksemme käyttökokemustasi.'
                    : '🍪 We use cookies to improve your experience.'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-amber-400 hover:text-amber-300 text-sm underline"
                >
                  {language === 'fi' ? 'Lue lisää' : 'Learn more'}
                </button>
                <button
                  onClick={declineCookies}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
                >
                  {language === 'fi' ? 'Hylkää' : 'Decline'}
                </button>
                <button
                  onClick={acceptCookies}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-sm font-bold"
                >
                  {language === 'fi' ? 'Hyväksy' : 'Accept'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-neutral-900 rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden border border-amber-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-neutral-800 px-4 py-3 flex justify-between items-center border-b border-amber-500/30">
              <h2 className="text-white font-bold text-sm">
                {language === 'fi' ? 'Tietosuojakäytäntö' : 'Privacy Policy'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh] text-white/70 text-xs space-y-3">
              {language === 'fi' ? (
                <>
                  <div>
                    <h3 className="text-amber-400 font-bold mb-1">Tietosuoja</h3>
                    <p>Victory Pizza kunnioittaa yksityisyyttäsi ja suojaa henkilötietojasi.</p>
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-bold mb-1">Evästeet</h3>
                    <p>Käytämme evästeitä sivuston toiminnan parantamiseen ja analytiikkaan.</p>
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-bold mb-1">Yhteystiedot</h3>
                    <p>Victory Pizza<br/>Puustellinpolku 25, 00410 Helsinki<br/>046 842 0302</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-amber-400 font-bold mb-1">Privacy</h3>
                    <p>Victory Pizza respects your privacy and protects your personal data.</p>
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-bold mb-1">Cookies</h3>
                    <p>We use cookies to improve website functionality and analytics.</p>
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-bold mb-1">Contact</h3>
                    <p>Victory Pizza<br/>Puustellinpolku 25, 00410 Helsinki<br/>046 842 0302</p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-neutral-800 px-4 py-3 border-t border-amber-500/30">
              <button
                onClick={closeModal}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-black rounded font-bold text-sm"
              >
                {language === 'fi' ? 'Sulje' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
