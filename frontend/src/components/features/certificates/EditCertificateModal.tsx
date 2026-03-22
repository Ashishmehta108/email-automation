"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateCertificateSchema, type UpdateCertificateFormValues } from '@/validations/certificate.schema';
import { useUpdateCertificate } from '@/hooks/useCertificates';
import type { CertificateDto } from '@/types/certificate.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EditCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: CertificateDto | null;
}

export function EditCertificateModal({ open, onOpenChange, certificate }: EditCertificateModalProps) {
  const { mutate, isPending } = useUpdateCertificate();

  const form = useForm<UpdateCertificateFormValues>({
    resolver: zodResolver(updateCertificateSchema),
    defaultValues: {
      eventName: '',
      issuedBy: '',
      issueDate: '',
    },
  });

  useEffect(() => {
    if (certificate) {
      form.reset({
        eventName: certificate.eventName,
        issuedBy: certificate.issuedBy,
        issueDate: certificate.issueDate,
      });
    }
  }, [certificate, form]);

  const onSubmit = (data: UpdateCertificateFormValues) => {
    if (!certificate) return;
    mutate({ id: certificate.id, data }, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Certificate</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Event Name</label>
            <input {...form.register('eventName')} className="w-full input-base" />
            {form.formState.errors.eventName && (
              <p className="text-sm text-error mt-1">{form.formState.errors.eventName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Issued By</label>
            <input {...form.register('issuedBy')} className="w-full input-base" />
            {form.formState.errors.issuedBy && (
              <p className="text-sm text-error mt-1">{form.formState.errors.issuedBy.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Issue Date</label>
            <input {...form.register('issueDate')} type="date" className="w-full input-base" />
            {form.formState.errors.issueDate && (
              <p className="text-sm text-error mt-1">{form.formState.errors.issueDate.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
