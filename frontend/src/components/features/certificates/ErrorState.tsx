import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>
      <h3 className="font-headline text-lg font-medium text-on-surface mb-2">Something went wrong</h3>
      <p className="text-outline text-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-6 py-2 rounded-sm border border-outline-variant/30 text-on-surface hover:bg-surface-high transition-colors">
          Try again
        </button>
      )}
    </div>
  );
}
