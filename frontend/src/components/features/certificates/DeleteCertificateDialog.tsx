"use client";

import { AlertTriangle } from 'lucide-react';
import { useDeleteCertificate } from '@/hooks/useCertificates';
import type { CertificateDto } from '@/types/certificate.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: CertificateDto | null;
}

export function DeleteCertificateDialog({ open, onOpenChange, certificate }: DeleteCertificateDialogProps) {
  const { mutate, isPending } = useDeleteCertificate();

  const handleDelete = () => {
    if (!certificate) return;
    mutate(certificate.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            Delete Certificate
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this certificate for Event "{certificate?.eventName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
