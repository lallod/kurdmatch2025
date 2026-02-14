import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VerificationForm } from '@/components/verification/VerificationForm';

const Verification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/10">
          <div className="max-w-md mx-auto px-4 h-12 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Get Verified</h1>
              <p className="text-xs text-muted-foreground">Increase trust and match quality</p>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-8">
          <VerificationForm />
        </div>
      </div>
    </div>
  );
};

export default Verification;
