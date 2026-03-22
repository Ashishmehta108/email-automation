import { db } from '../db/index.js';
import { emailLogs } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import type { EmailLog, EmailLogStatus, CreateEmailLogInput, UpdateEmailLogInput, EmailLogFilter } from '../types/index.js';

export class EmailLogRepository {
  /**
   * Create a new email log
   */
  async create(input: CreateEmailLogInput): Promise<EmailLog> {
    const result = await db
      .insert(emailLogs)
      .values({
        certificateId: input.certificateId,
        recipientEmail: input.recipientEmail,
        subject: input.subject,
        status: input.status || 'pending',
      })
      .returning();
    
    return result[0];
  }

  /**
   * Find an email log by ID
   */
  async findById(id: number): Promise<EmailLog | null> {
    const result = await db
      .select()
      .from(emailLogs)
      .where(eq(emailLogs.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Get all email logs with optional filtering and pagination
   */
  async findAll(filter?: EmailLogFilter): Promise<EmailLog[]> {
    const conditions = [];
    
    if (filter?.certificateId) {
      conditions.push(eq(emailLogs.certificateId, filter.certificateId));
    }
    
    if (filter?.status) {
      conditions.push(eq(emailLogs.status, filter.status));
    }
    
    if (filter?.recipientEmail) {
      conditions.push(eq(emailLogs.recipientEmail, filter.recipientEmail));
    }

    const query = db.select().from(emailLogs);
    
    if (conditions.length > 0) {
      // @ts-ignore - Drizzle query builder type issue
      query.where(conditions[0]);
    }

    // @ts-ignore - Drizzle query builder type issue
    const result = query.orderBy(desc(emailLogs.createdAt));

    if (filter?.limit) {
      // @ts-ignore
      result.limit(filter.limit);
    }

    if (filter?.offset) {
      // @ts-ignore
      result.offset(filter.offset);
    }

    return result;
  }

  /**
   * Update an email log by ID
   */
  async update(id: number, input: UpdateEmailLogInput): Promise<EmailLog | null> {
    const result = await db
      .update(emailLogs)
      .set(input)
      .where(eq(emailLogs.id, id))
      .returning();
    
    return result[0] || null;
  }

  /**
   * Mark email as sent
   */
  async markAsSent(id: number): Promise<EmailLog | null> {
    return this.update(id, { status: 'sent', sentAt: new Date() });
  }

  /**
   * Mark email as failed
   */
  async markAsFailed(id: number, errorMessage: string): Promise<EmailLog | null> {
    return this.update(id, { status: 'failed', errorMessage });
  }

  /**
   * Get failed email logs for retry
   */
  async getFailed(limit: number = 10): Promise<EmailLog[]> {
    return db
      .select()
      .from(emailLogs)
      .where(eq(emailLogs.status, 'failed'))
      .orderBy(emailLogs.createdAt)
      .limit(limit);
  }

  /**
   * Count email logs by status
   */
  async countByStatus(status: EmailLogStatus): Promise<number> {
    const result = await db
      .select({ id: emailLogs.id })
      .from(emailLogs)
      .where(eq(emailLogs.status, status));
    
    return result.length;
  }
}

export const emailLogRepository = new EmailLogRepository();
