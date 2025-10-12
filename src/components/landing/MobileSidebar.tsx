import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, Info, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, LanguageCode } from '@/contexts/LanguageContext';
import { useAuth } from '@/integrations/supabase/auth';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const languages: Array<{ code: LanguageCode; label: string; flag: string }> = [
    { code: 'english', label: 'English', flag: '🇬🇧' },
    { code: 'kurdish_sorani', label: 'کوردی (سۆرانی)', flag: '🟥⚪️🟩' },
    { code: 'kurdish_kurmanci', label: 'Kurdî (Kurmancî)', flag: '🟨🔴🟩' },
    { code: 'norwegian', label: 'Norsk', flag: '🇳🇴' },
    { code: 'german', label: 'Deutsch', flag: '🇩🇪' },
  ];

  const menuItems = [
    { icon: LogIn, label: 'Login', path: '/login' },
    { icon: UserPlus, label: 'Registration', path: '/register' },
    { icon: Info, label: 'About Us', path: '/about' },
    { icon: Mail, label: 'Contact Us', path: '/contact' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLanguageChange = (code: LanguageCode) => {
    setLanguage(code);
    onClose();
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { 
      x: 0,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 300
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 z-50 shadow-2xl"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl">❤️</span>
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">KurdMatch</h2>
                      <p className="text-purple-200 text-xs">Kurdish Hearts</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-6 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.path}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleNavigate(item.path)}
                    className="w-full flex items-center gap-4 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Language Selector */}
              <div className="p-6 border-t border-white/10">
                <motion.div
                  custom={menuItems.length}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-purple-200 mb-3">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Language</span>
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                        language === lang.code
                          ? 'bg-white/20 text-white'
                          : 'text-purple-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
