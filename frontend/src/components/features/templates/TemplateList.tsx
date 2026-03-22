import type { TemplateDto } from '@/types/template.types';
import { TemplateRow } from './TemplateRow';

interface TemplateListProps {
  templates: TemplateDto[];
  onEdit: (template: TemplateDto) => void;
  onDelete: (template: TemplateDto) => void;
}

export function TemplateList({ templates, onEdit, onDelete }: TemplateListProps) {
  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <TemplateRow
          key={template.id}
          template={template}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
