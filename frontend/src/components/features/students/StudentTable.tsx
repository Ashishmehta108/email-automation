import type { StudentDto } from '@/types/student.types';
import { StudentRow } from './StudentRow';

interface StudentTableProps {
  students: StudentDto[];
  onEdit: (student: StudentDto) => void;
  onDelete: (student: StudentDto) => void;
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 px-6 mb-4 text-[10px] uppercase tracking-[0.2em] text-outline font-medium">
        <div className="col-span-4">Student Name</div>
        <div className="col-span-2 text-center">Roll No.</div>
        <div className="col-span-3">Email Address</div>
        <div className="col-span-2">Created At</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>
      {students.map((student) => (
        <StudentRow
          key={student.id}
          student={student}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
