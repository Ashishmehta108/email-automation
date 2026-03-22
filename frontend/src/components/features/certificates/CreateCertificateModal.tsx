"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCertificateSchema, type CreateCertificateFormValues } from '@/validations/certificate.schema';
import { useCreateCertificate } from '@/hooks/useCertificates';
import { useStudents } from '@/hooks/useStudents';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CreateCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCertificateModal({ open, onOpenChange }: CreateCertificateModalProps) {
  const { mutate, isPending } = useCreateCertificate();
  const { data: studentsData, isLoading: isLoadingStudents } = useStudents();
  const students = studentsData?.data || [];

  const form = useForm<CreateCertificateFormValues>({
    resolver: zodResolver(createCertificateSchema),
    defaultValues: {
      studentId: undefined,
      eventName: '',
      issuedBy: '',
      issueDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: CreateCertificateFormValues) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Certificate</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Student</label>
            {isLoadingStudents ? (
              <div className="flex items-center gap-2 text-outline">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading students...
              </div>
            ) : (
              <select
                {...form.register('studentId', { valueAsNumber: true })}
                className="w-full input-base"
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.rollNo})
                  </option>
                ))}
              </select>
            )}
            {form.formState.errors.studentId && (
              <p className="text-sm text-error mt-1">{form.formState.errors.studentId.message}</p>
            )}
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
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
