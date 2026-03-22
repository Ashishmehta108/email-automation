import { Pencil, Trash2 } from 'lucide-react';
import type { StudentDto } from '@/types/student.types';

interface StudentRowProps {
  student: StudentDto;
  onEdit: (student: StudentDto) => void;
  onDelete: (student: StudentDto) => void;
}

export function StudentRow({ student, onEdit, onDelete }: StudentRowProps) {
  const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  return (
    <div className="grid grid-cols-12 gap-4 items-center glass-panel px-6 py-5 rounded-sm border border-white/5 transition-all duration-300 row-hover-effect">
      <div className="col-span-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-surface-highest rounded-full flex items-center justify-center border border-white/10 text-primary font-headline font-bold">
          {initials}
        </div>
        <div>
          <p className="text-on-surface font-medium text-sm">{student.name}</p>
          <p className="text-[11px] text-outline/60 mt-0.5">{student.rollNo}</p>
        </div>
      </div>
      <div className="col-span-2 text-center font-headline text-on-surface-variant tracking-wider">
        #{student.rollNo}
      </div>
      <div className="col-span-3 text-outline text-sm italic">{student.email}</div>
      <div className="col-span-2 text-outline text-xs tabular-nums">
        {new Date(student.createdAt).toLocaleDateString()}
      </div>
      <div className="col-span-1 flex justify-end gap-3 text-outline">
        <button onClick={() => onEdit(student)} className="hover:text-primary transition-colors">
          <Pencil className="w-[18px] h-[18px]" />
        </button>
        <button onClick={() => onDelete(student)} className="hover:text-error transition-colors">
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
