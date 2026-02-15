import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'kurdmatch_cookie_consent';

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4"
        >
          <div className="max-w-lg mx-auto bg-card border border-border/50 rounded-2xl p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">We use cookies 🍪</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    We use cookies to enhance your experience, keep you logged in, and analyze platform usage.{' '}
                    <Link to="/cookie-policy" className="text-primary hover:underline">
                      Learn more
                    </Link>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={accept} className="rounded-xl text-xs h-8 px-4 bg-primary text-primary-foreground">
                    Accept All
                  </Button>
                  <Button size="sm" variant="outline" onClick={decline} className="rounded-xl text-xs h-8 px-4">
                    Essential Only
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={decline} className="rounded-full h-8 w-8 shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
