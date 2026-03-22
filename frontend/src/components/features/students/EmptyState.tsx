import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description?: string;
  cta?: string;
  onCtaClick?: () => void;
}

export function EmptyState({ title, description, cta, onCtaClick }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-surface-highest flex items-center justify-center mx-auto mb-4">
        <Plus className="w-8 h-8 text-outline" />
      </div>
      <h3 className="font-headline text-lg font-medium text-on-surface mb-2">{title}</h3>
      {description && <p className="text-outline text-sm mb-4">{description}</p>}
      {cta && (
        <Button onClick={onCtaClick} className="btn-primary-gradient">
          {cta}
        </Button>
      )}
    </div>
  );
}
