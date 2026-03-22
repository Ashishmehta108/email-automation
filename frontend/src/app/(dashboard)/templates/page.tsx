"use client";

import { useState } from 'react';
import { useTemplates } from '@/hooks/useTemplates';
import { TemplateList } from '@/components/features/templates/TemplateList';
import { TemplateSkeleton } from '@/components/features/templates/TemplateSkeleton';
import { EmptyState } from '@/components/features/students/EmptyState';
import { ErrorState } from '@/components/features/students/ErrorState';
import { CreateTemplateModal } from '@/components/features/templates/CreateTemplateModal';
import { EditTemplateModal } from '@/components/features/templates/EditTemplateModal';
import { DeleteTemplateDialog } from '@/components/features/templates/DeleteTemplateDialog';
import type { TemplateDto } from '@/types/template.types';
import { Button } from '@/components/ui/button';

export default function TemplatesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDto | null>(null);

  const { data, isLoading, error, refetch } = useTemplates();

  const handleEdit = (template: TemplateDto) => {
    setSelectedTemplate(template);
    setEditOpen(true);
  };

  const handleDelete = (template: TemplateDto) => {
    setSelectedTemplate(template);
    setDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
              Email Templates
            </h2>
            <p className="text-sm text-outline mt-1">Manage your email templates</p>
          </div>
          <Button className="btn-primary-gradient">Create Template</Button>
        </div>
        <TemplateSkeleton />
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

  const templates = data?.data?.data || [];

  return (
    <div className="p-10 max-w-7xl w-full mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-3xl font-light tracking-tight text-on-surface">
            Email Templates
          </h2>
          <p className="text-sm text-outline mt-1">

            {templates.length} template{templates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button className="btn-primary-gradient" onClick={() => setCreateOpen(true)}>
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          title="No templates yet"
          description="Create your first email template to get started"
          cta="Create Template"
          onCtaClick={() => setCreateOpen(true)}
        />
      ) : (
        <TemplateList
          templates={templates}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CreateTemplateModal open={createOpen} onOpenChange={setCreateOpen} />
      <EditTemplateModal
        open={editOpen}
        onOpenChange={setEditOpen}
        template={selectedTemplate}
      />
      <DeleteTemplateDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        template={selectedTemplate}
      />
    </div>
  );
}
