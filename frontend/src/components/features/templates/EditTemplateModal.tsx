"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTemplateSchema, type UpdateTemplateFormValues } from '@/validations/template.schema';
import { useUpdateTemplate } from '@/hooks/useTemplates';
import type { TemplateDto } from '@/types/template.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface EditTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: TemplateDto | null;
}

export function EditTemplateModal({ open, onOpenChange, template }: EditTemplateModalProps) {
  const { mutate, isPending } = useUpdateTemplate();

  const form = useForm<UpdateTemplateFormValues>({
    resolver: zodResolver(updateTemplateSchema),
    defaultValues: {
      name: '',
      subject: '',
      body: '',
    },
  });

  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        subject: template.subject,
        body: template.body,
      });
    }
  }, [template, form]);

  const onSubmit = (data: UpdateTemplateFormValues) => {
    if (!template) return;
    mutate({ id: template.id, data }, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Name</label>
            <input {...form.register('name')} className="w-full input-base" />
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Subject</label>
            <input {...form.register('subject')} className="w-full input-base" />
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Body</label>
            <Textarea {...form.register('body')} className="w-full input-base min-h-[200px]" />
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
