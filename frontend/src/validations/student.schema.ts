import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
  email: z.string().email('Invalid email address'),
});

export const updateStudentSchema = createStudentSchema.partial();

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
export type UpdateStudentFormValues = z.infer<typeof updateStudentSchema>;
