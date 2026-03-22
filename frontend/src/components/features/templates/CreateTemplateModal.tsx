"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTemplateSchema, type CreateTemplateFormValues } from '@/validations/template.schema';
import { useCreateTemplate } from '@/hooks/useTemplates';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTemplateModal({ open, onOpenChange }: CreateTemplateModalProps) {
  const { mutate, isPending } = useCreateTemplate();

  const form = useForm<CreateTemplateFormValues>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: '',
      subject: '',
      body: '',
      variables: [],
    },
  });

  const onSubmit = (data: CreateTemplateFormValues) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-label-md text-outline mb-2">Name</label>
            <input
              {...form.register('name')}
              className="w-full input-base"
              placeholder="Welcome Email"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-error mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Subject</label>
            <input
              {...form.register('subject')}
              className="w-full input-base"
              placeholder="Welcome to our platform!"
            />
            {form.formState.errors.subject && (
              <p className="text-sm text-error mt-1">{form.formState.errors.subject.message}</p>
            )}
          </div>
          <div>
            <label className="block text-label-md text-outline mb-2">Body</label>
            <Textarea
              {...form.register('body')}
              className="w-full input-base min-h-[200px]"
              placeholder="Dear {{name}}, welcome aboard..."
            />
            {form.formState.errors.body && (
              <p className="text-sm text-error mt-1">{form.formState.errors.body.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
