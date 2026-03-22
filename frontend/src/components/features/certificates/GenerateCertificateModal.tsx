"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateCertificateSchema, type GenerateCertificateFormValues } from '@/validations/certificate.schema';
import { useGenerateCertificate } from '@/hooks/useCertificates';
import type { CertificateDto } from '@/types/certificate.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GenerateCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: CertificateDto | null;
}

export function GenerateCertificateModal({ open, onOpenChange, certificate }: GenerateCertificateModalProps) {
  const { mutate, isPending } = useGenerateCertificate();

  const form = useForm<GenerateCertificateFormValues>({
    resolver: zodResolver(generateCertificateSchema),
    defaultValues: {
      studentId: certificate?.studentId,
      eventName: certificate?.eventName || '',
      issuedBy: certificate?.issuedBy || '',
      issueDate: certificate?.issueDate || new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: GenerateCertificateFormValues) => {
    mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Certificate PDF</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Student ID</label>
            <input
              {...form.register('studentId', { valueAsNumber: true })}
              className="w-full input-base"
              disabled
            />
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Event Name</label>
            <input
              {...form.register('eventName')}
              className="w-full input-base"
              placeholder="Annual Tech Fest 2024"
            />
            {form.formState.errors.eventName && (
              <p className="text-sm text-error mt-1">{form.formState.errors.eventName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Issued By</label>
            <input
              {...form.register('issuedBy')}
              className="w-full input-base"
              placeholder="Dr. John Smith"
            />
            {form.formState.errors.issuedBy && (
              <p className="text-sm text-error mt-1">{form.formState.errors.issuedBy.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Issue Date</label>
            <input
              {...form.register('issueDate')}
              type="date"
              className="w-full input-base"
            />
            {form.formState.errors.issueDate && (
              <p className="text-sm text-error mt-1">{form.formState.errors.issueDate.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Generating...' : 'Generate PDF'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
