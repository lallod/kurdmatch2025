
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface FooterContent {
  copyright: string;
}

interface FooterProps {
  content?: FooterContent;
}

// Default content
const defaultContent: FooterContent = {
  copyright: "© 2023 Kurdish Dating. All rights reserved."
};

const Footer: React.FC<FooterProps> = ({ content = defaultContent }) => {
  return (
    <footer className="py-8 bg-black/60 backdrop-blur-sm mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <Logo size="small" withText={true} />
            <span className="ml-2 text-sm text-gray-500">{content.copyright}</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
              Privacy
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
