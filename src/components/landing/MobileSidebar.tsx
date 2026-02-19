import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, Info, Mail, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, LanguageCode } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages: Array<{ code: LanguageCode; label: string; flag: string }> = [
  { code: 'english', label: 'English', flag: '🇬🇧' },
  { code: 'kurdish_sorani', label: 'کوردی', flag: '🟥⚪️🟩' },
  { code: 'kurdish_kurmanci', label: 'Kurmancî', flag: '🟨🔴🟩' },
  { code: 'norwegian', label: 'Norsk', flag: '🇳🇴' },
  { code: 'german', label: 'Deutsch', flag: '🇩🇪' },
];

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations();

  const menuItems = [
    { icon: LogIn, label: t('sidebar.login', 'Login'), path: '/auth' },
    { icon: UserPlus, label: t('sidebar.registration', 'Registration'), path: '/register' },
    { icon: Info, label: t('sidebar.about', 'About Us'), path: '/#about' },
    { icon: Mail, label: t('sidebar.contact', 'Contact Us'), path: '/#contact' },
  ];

  const handleNavigate = (path: string) => { navigate(path); onClose(); };
  const handleLanguageChange = (code: LanguageCode) => { setLanguage(code); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 left-0 h-full w-72 bg-background z-50 shadow-xl flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-foreground font-semibold text-lg">KurdMatch</span>
              <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-3 px-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full flex items-center justify-between px-3 py-3 text-foreground hover:bg-muted rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </button>
              ))}
            </nav>

            {/* Language Picker */}
            <div className="px-4 py-4 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium mb-2 px-1">{t('sidebar.language', 'Language')}</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      language === lang.code
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
