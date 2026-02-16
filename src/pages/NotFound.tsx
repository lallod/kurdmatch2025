import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslations();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">KurdMatch</span>
        </div>
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground">{t('error.page_not_found', "This page doesn't exist")}</p>
        <Button asChild variant="default" size="lg">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />{t('error.back_home', 'Back to Home')}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
