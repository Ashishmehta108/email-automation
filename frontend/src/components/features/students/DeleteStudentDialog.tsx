"use client";

import { AlertTriangle } from 'lucide-react';
import { useDeleteStudent } from '@/hooks/useStudents';
import type { StudentDto } from '@/types/student.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentDto | null;
}

export function DeleteStudentDialog({ open, onOpenChange, student }: DeleteStudentDialogProps) {
  const { mutate, isPending } = useDeleteStudent();

  const handleDelete = () => {
    if (!student) return;
    mutate(student.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            Delete Student
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {student?.name}? This action cannot be undone.
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
