"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStudentSchema, type CreateStudentFormValues } from '@/validations/student.schema';
import { useCreateStudent } from '@/hooks/useStudents';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CreateStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStudentModal({ open, onOpenChange }: CreateStudentModalProps) {
  const { mutate, isPending } = useCreateStudent();

  const form = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: '',
      rollNo: '',
      email: '',
    },
  });

  const onSubmit = (data: CreateStudentFormValues) => {
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
          <DialogTitle>Create Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Name</label>
            <input
              {...form.register('name')}
              className="input-base w-full"
              placeholder="John Doe"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-error mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Roll Number</label>
            <input
              {...form.register('rollNo')}
              className="input-base w-full"
              placeholder="AR-2024-001"
            />
            {form.formState.errors.rollNo && (
              <p className="text-sm text-error mt-1">{form.formState.errors.rollNo.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Email</label>
            <input
              {...form.register('email')}
              type="email"
              className="input-base w-full"
              placeholder="john@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-error mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary-gradient" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
