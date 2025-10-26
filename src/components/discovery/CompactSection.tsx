import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface CompactSectionProps {
  icon: ReactNode;
  title: string;
  count: number;
  onClick: () => void;
}

export const CompactSection = ({ icon, title, count, onClick }: CompactSectionProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-card border border-border hover:bg-accent/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">
          {icon}
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{count} items</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </button>
  );
};
