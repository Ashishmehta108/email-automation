"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateStudentSchema, type UpdateStudentFormValues } from '@/validations/student.schema';
import { useUpdateStudent } from '@/hooks/useStudents';
import type { StudentDto } from '@/types/student.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EditStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentDto | null;
}

export function EditStudentModal({ open, onOpenChange, student }: EditStudentModalProps) {
  const { mutate, isPending } = useUpdateStudent();

  const form = useForm<UpdateStudentFormValues>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      name: '',
      rollNo: '',
      email: '',
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        rollNo: student.rollNo,
        email: student.email,
      });
    }
  }, [student, form]);

  const onSubmit = (data: UpdateStudentFormValues) => {
    if (!student) return;
    mutate({ id: student.id, data }, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Name</label>
            <input {...form.register('name')} className="w-full input-base" />
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Roll Number</label>
            <input {...form.register('rollNo')} className="w-full input-base" />
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Email</label>
            <input {...form.register('email')} type="email" className="w-full input-base" />
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
