import { db } from '../db/index.js';
import { emailTemplates } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import type { EmailTemplate, NewEmailTemplate } from '../types/index.js';

export interface EmailTemplateFilter {
  search?: string;
  limit?: number;
  offset?: number;
}

export class EmailTemplateRepository {
  /**
   * Create a new email template
   */
  async create(input: NewEmailTemplate): Promise<EmailTemplate> {
    const result = await db
      .insert(emailTemplates)
      .values({
        name: input.name,
        subject: input.subject,
        body: input.body,
        variables: input.variables || [],
      })
      .returning();

    return result[0];
  }

  /**
   * Find a template by ID
   */
  async findById(id: number): Promise<EmailTemplate | null> {
    const result = await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get all templates with optional filtering and pagination
   */
  async findAll(filter?: EmailTemplateFilter): Promise<EmailTemplate[]> {
    const query = db.select().from(emailTemplates);

    if (filter?.search) {
      query.where(eq(emailTemplates.name, filter.search));
    }

    const result = query.orderBy(desc(emailTemplates.createdAt));

    if (filter?.limit) {
      result.limit(filter.limit);
    }

    if (filter?.offset) {
      result.offset(filter.offset);
    }

    return result;
  }

  /**
   * Update a template by ID
   */
  async update(id: number, input: Partial<NewEmailTemplate>): Promise<EmailTemplate | null> {
    const result = await db
      .update(emailTemplates)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(emailTemplates.id, id))
      .returning();

    return result[0] || null;
  }

  /**
   * Delete a template by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(emailTemplates)
      .where(eq(emailTemplates.id, id))
      .returning({ id: emailTemplates.id });

    return result.length > 0;
  }

  /**
   * Count total templates
   */
  async count(): Promise<number> {
    const result = await db
      .select({ count: emailTemplates.id })
      .from(emailTemplates);

    return result.length;
  }
}

export const emailTemplateRepository = new EmailTemplateRepository();
