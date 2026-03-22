"use client";

import { useState } from 'react';
import { useStudents } from '@/hooks/useStudents';
import { Plus } from 'lucide-react';
import { StudentTable } from '@/components/features/students/StudentTable';
import { StudentTableSkeleton } from '@/components/features/students/StudentTableSkeleton';
import { EmptyState } from '@/components/features/students/EmptyState';
import { ErrorState } from '@/components/features/students/ErrorState';
import { CreateStudentModal } from '@/components/features/students/CreateStudentModal';
import { EditStudentModal } from '@/components/features/students/EditStudentModal';
import { DeleteStudentDialog } from '@/components/features/students/DeleteStudentDialog';
import type { StudentDto } from '@/types/student.types';
import { Button } from '@/components/ui/button';

export default function StudentsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null);

  const { data, isLoading, error, refetch } = useStudents();

  const handleEdit = (student: StudentDto) => {
    setSelectedStudent(student);
    setEditOpen(true);
  };

  const handleDelete = (student: StudentDto) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
              Student Directory
            </h2>
            <p className="text-sm text-outline mt-1">Managing student profiles</p>
          </div>
          <Button className="btn-primary-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
        <StudentTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 max-w-7xl w-full mx-auto">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  const students = data?.data || [];

  return (
    <div className="p-10 max-w-7xl w-full mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
            Student Directory
          </h2>
          <p className="text-sm text-outline mt-1">
            {students.length} active students
          </p>
        </div>
        <Button className="btn-primary-gradient" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {students.length === 0 ? (
        <EmptyState
          title="No students yet"
          description="Get started by adding your first student"
          cta="Add Student"
          onCtaClick={() => setCreateOpen(true)}
        />
      ) : (
        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CreateStudentModal open={createOpen} onOpenChange={setCreateOpen} />
      <EditStudentModal
        open={editOpen}
        onOpenChange={setEditOpen}
        student={selectedStudent}
      />
      <DeleteStudentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        student={selectedStudent}
      />
    </div>
  );
}
