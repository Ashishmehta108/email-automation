import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  variables: z.array(z.string()).optional(),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export type CreateTemplateFormValues = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateFormValues = z.infer<typeof updateTemplateSchema>;
