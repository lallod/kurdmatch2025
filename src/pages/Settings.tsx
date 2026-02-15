import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AccountSettings from '@/components/my-profile/AccountSettings';
import { useTranslations } from '@/hooks/useTranslations';

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslations();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">{t('settings.title', 'Settings')}</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        <div className="max-w-lg mx-auto"><AccountSettings /></div>
      </div>
    </div>
  );
}
