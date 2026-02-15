
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useTranslations } from '@/hooks/useTranslations';

interface FooterContent {
  copyright: string;
}

interface FooterProps {
  content?: FooterContent;
}

// Default content
const defaultContent: FooterContent = {
  copyright: `© ${new Date().getFullYear()} KurdMatch. All rights reserved.`
};

const Footer: React.FC<FooterProps> = ({ content = defaultContent }) => {
  const { t } = useTranslations();
  return (
    <footer className="py-8 bg-card/30 backdrop-blur-sm mt-auto border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <Logo size="small" withText={true} />
            <span className="ml-2 text-sm text-muted-foreground">{content.copyright}</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('common.terms', 'Terms')}
            </Link>
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('common.privacy', 'Privacy')}
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('common.contact', 'Contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
