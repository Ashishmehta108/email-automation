import { db } from '../db/index.js';
import { certificates } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';
import type { Certificate, CertificateStatus, CreateCertificateInput, UpdateCertificateInput, CertificateFilter } from '../types/index.js';

export class CertificateRepository {
  /**
   * Create a new certificate record
   */
  async create(input: CreateCertificateInput): Promise<Certificate> {
    const result = await db
      .insert(certificates)
      .values({
        studentId: input.studentId,
        templateId: input.templateId,
        eventName: input.eventName,
        issuedBy: input.issuedBy,
        issueDate: input.issueDate,
        status: 'pending',
      })
      .returning();
    
    return result[0];
  }

  /**
   * Find a certificate by ID
   */
  async findById(id: number): Promise<Certificate | null> {
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Find a certificate by student ID
   */
  async findByStudentId(studentId: number): Promise<Certificate | null> {
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.studentId, studentId))
      .orderBy(desc(certificates.createdAt))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Get all certificates with optional filtering and pagination
   */
  async findAll(filter?: CertificateFilter): Promise<Certificate[]> {
    const conditions = [];
    
    if (filter?.studentId) {
      conditions.push(eq(certificates.studentId, filter.studentId));
    }
    
    if (filter?.status) {
      conditions.push(eq(certificates.status, filter.status));
    }
    
    if (filter?.eventName) {
      conditions.push(eq(certificates.eventName, filter.eventName));
    }

    const query = db.select().from(certificates);
    
    if (conditions.length > 0) {
      // @ts-ignore - Drizzle query builder type issue
      query.where(and(...conditions));
    }

    // @ts-ignore - Drizzle query builder type issue
    const result = query.orderBy(desc(certificates.createdAt));

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
   * Update a certificate by ID
   */
  async update(id: number, input: UpdateCertificateInput): Promise<Certificate | null> {
    const result = await db
      .update(certificates)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(certificates.id, id))
      .returning();
    
    return result[0] || null;
  }

  /**
   * Update certificate status
   */
  async updateStatus(id: number, status: CertificateStatus): Promise<Certificate | null> {
    return this.update(id, { status });
  }

  /**
   * Set PDF path for a certificate
   */
  async setPdfPath(id: number, pdfPath: string): Promise<Certificate | null> {
    return this.update(id, { pdfPath, status: 'generated' });
  }

  /**
   * Delete a certificate by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(certificates)
      .where(eq(certificates.id, id));
    
    return (result.rowCount || 0) > 0;
  }

  /**
   * Count certificates by status
   */
  async countByStatus(status: CertificateStatus): Promise<number> {
    const result = await db
      .select({ id: certificates.id })
      .from(certificates)
      .where(eq(certificates.status, status));
    
    return result.length;
  }

  /**
   * Get pending certificates
   */
  async getPending(limit: number = 10): Promise<Certificate[]> {
    return db
      .select()
      .from(certificates)
      .where(eq(certificates.status, 'pending'))
      .orderBy(certificates.createdAt)
      .limit(limit);
  }
}

export const certificateRepository = new CertificateRepository();
