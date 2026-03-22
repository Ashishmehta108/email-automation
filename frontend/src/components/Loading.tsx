import { Spinner } from '@/components/ui/spinner';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-surface-lowest/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner className="w-10 h-10 text-primary mx-auto mb-4" />
        <p className="text-sm text-outline">{message}</p>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-lowest">
      <div className="text-center">
        <Spinner className="w-10 h-10 text-primary mx-auto mb-4" />
        <p className="text-sm text-outline">Loading...</p>
      </div>
    </div>
  );
}
