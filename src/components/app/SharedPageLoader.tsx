import React from 'react';
import { Loader2 } from 'lucide-react';

const SharedPageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-muted">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

export default SharedPageLoader;
