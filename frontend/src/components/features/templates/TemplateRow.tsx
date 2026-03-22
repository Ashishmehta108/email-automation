import { Pencil, Trash2 } from 'lucide-react';
import type { TemplateDto } from '@/types/template.types';

interface TemplateRowProps {
  template: TemplateDto;
  onEdit: (template: TemplateDto) => void;
  onDelete: (template: TemplateDto) => void;
}

export function TemplateRow({ template, onEdit, onDelete }: TemplateRowProps) {
  const varCount = template.variables?.length || 0;

  return (
    <div className="glass-panel px-6 py-5 rounded-sm border border-white/5 transition-all duration-300 hover:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-on-surface font-medium text-sm">{template.name}</h3>
            {varCount > 0 && (
              <span className="text-[10px] uppercase tracking-[0.1em] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {varCount} variable{varCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-outline text-sm italic mb-2">{template.subject}</p>
          <p className="text-outline text-xs line-clamp-2">{template.body}</p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <button onClick={() => onEdit(template)} className="text-outline hover:text-primary transition-colors">
            <Pencil className="w-[18px] h-[18px]" />
          </button>
          <button onClick={() => onDelete(template)} className="text-outline hover:text-error transition-colors">
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
