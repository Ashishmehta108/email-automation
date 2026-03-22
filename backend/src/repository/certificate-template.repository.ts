import { db } from '../db/index.js';
import { certificateTemplates } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';
import type { CertificateTemplate, CreateTemplateInput, UpdateTemplateInput, TemplateFilter } from '../types/index.js';
import type { CertificateTemplateConfig } from '../db/schema.js';

export class CertificateTemplateRepository {
  /**
   * Create a new certificate template
   */
  async create(input: CreateTemplateInput): Promise<CertificateTemplate> {
    const configValue: CertificateTemplateConfig = input.config || {};
    
    const result = await db
      .insert(certificateTemplates)
      .values({
        name: input.name,
        description: input.description,
        config: configValue,
        width: input.width || '841.89',
        height: input.height || '595.28',
        backgroundColor: input.backgroundColor,
        backgroundImageUrl: input.backgroundImageUrl,
        showBorder: input.showBorder,
        borderColor: input.borderColor,
        borderWidth: input.borderWidth,
        showInnerBorder: input.showInnerBorder,
        innerBorderColor: input.innerBorderColor,
        innerBorderWidth: input.innerBorderWidth,
        titleText: input.titleText,
        titleFont: input.titleFont,
        titleSize: input.titleSize,
        titleColor: input.titleColor,
        titleY: input.titleY,
        nameFont: input.nameFont,
        nameSize: input.nameSize,
        nameColor: input.nameColor,
        nameY: input.nameY,
        descriptionText: input.descriptionText,
        descriptionFont: input.descriptionFont,
        descriptionSize: input.descriptionSize,
        descriptionColor: input.descriptionColor,
        descriptionY: input.descriptionY,
        eventFont: input.eventFont,
        eventSize: input.eventSize,
        eventColor: input.eventColor,
        eventY: input.eventY,
        dateText: input.dateText,
        dateFont: input.dateFont,
        dateSize: input.dateSize,
        dateColor: input.dateColor,
        dateY: input.dateY,
        issuedByFont: input.issuedByFont,
        issuedBySize: input.issuedBySize,
        issuedByColor: input.issuedByColor,
        issuedByY: input.issuedByY,
        footerText: input.footerText,
        footerFont: input.footerFont,
        footerSize: input.footerSize,
        footerColor: input.footerColor,
      })
      .returning();
    
    return result[0];
  }

  /**
   * Find a template by ID
   */
  async findById(id: number): Promise<CertificateTemplate | null> {
    const result = await db
      .select()
      .from(certificateTemplates)
      .where(eq(certificateTemplates.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Get all templates with optional filtering and pagination
   */
  async findAll(filter?: TemplateFilter): Promise<CertificateTemplate[]> {
    const conditions = [];
    
    if (filter?.isActive !== undefined) {
      conditions.push(eq(certificateTemplates.isActive, filter.isActive));
    }

    const query = db.select().from(certificateTemplates);
    
    if (conditions.length > 0) {
      // @ts-ignore - Drizzle query builder type issue
      query.where(and(...conditions));
    }

    // @ts-ignore - Drizzle query builder type issue
    const result = query.orderBy(desc(certificateTemplates.createdAt));

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
   * Get active templates only
   */
  async findActive(): Promise<CertificateTemplate[]> {
    return db
      .select()
      .from(certificateTemplates)
      .where(eq(certificateTemplates.isActive, true))
      .orderBy(desc(certificateTemplates.createdAt));
  }

  /**
   * Update a template by ID
   */
  async update(id: number, input: UpdateTemplateInput): Promise<CertificateTemplate | null> {
    const result = await db
      .update(certificateTemplates)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(certificateTemplates.id, id))
      .returning();
    
    return result[0] || null;
  }

  /**
   * Activate or deactivate a template
   */
  async toggleActive(id: number): Promise<CertificateTemplate | null> {
    const template = await this.findById(id);
    if (!template) return null;
    
    return this.update(id, { isActive: !template.isActive });
  }

  /**
   * Delete a template by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(certificateTemplates)
      .where(eq(certificateTemplates.id, id))
      .returning({ id: certificateTemplates.id });
    
    return result.length > 0;
  }

  /**
   * Count total templates
   */
  async count(): Promise<number> {
    const result = await db
      .select({ count: certificateTemplates.id })
      .from(certificateTemplates);
    
    return result.length;
  }

  /**
   * Count active templates
   */
  async countActive(): Promise<number> {
    const result = await db
      .select({ id: certificateTemplates.id })
      .from(certificateTemplates)
      .where(eq(certificateTemplates.isActive, true));
    
    return result.length;
  }
}

export const certificateTemplateRepository = new CertificateTemplateRepository();
